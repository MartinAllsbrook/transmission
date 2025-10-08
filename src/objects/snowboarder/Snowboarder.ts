import { GameObject, Parent } from "../GameObject.ts";
import { Vector2D } from "../../math/Vector2D.ts";
import Game from "islands/Game.tsx";
import { LayerManager } from "../../rendering/LayerManager.ts";
import { SATCollider } from "../../colliders/SATCollider.ts";
import { Snowboard } from "./Snowboard.ts";
import { Body } from "./Body.ts";
import { Shadow } from "./Shadow.ts";
import { InputManager } from "../../inputs/InputManager.ts";
import { TricksManager } from "./TricksManager.ts";
import { State } from "./states/State.ts";
import { GroundState } from "./states/GroundState.ts";
import { AirState } from "./states/AirState.ts";

export interface Settings {
    // Base movement
    
    // Shifty
    maxShiftyAngle: number;
    shiftyLerpSpeed: number;
}

export interface Inputs {
    turn: number;
    jump: boolean;
    shifty: number;
}

export interface StateData {
    // Base movement
    worldPosition: Vector2D;
    velocity: Vector2D;
    rotationRate: number;
    
    // Height
    height: number;
    verticalVelocity: number;

    // Shifty
    shiftyTargetAngle: number;
    shiftyAngle: number;
}

export class Snowboarder extends GameObject {
    /** TODO: THIS IS **DEPRECIATED** AND WE SHOULD USE PLAYERSTATE INSTEAD */
    private inAir = false;
    
    /** 
     * The current state of the player, used to update the player and handle state transitions
     */
    private playerState: State;
    
    /**
     * Settings of the player
     */
    private readonly settings: Settings = {
        
        maxShiftyAngle: 90,
        shiftyLerpSpeed: 3
    }
    
    /**
     * Inputs to the player, should only be set by InputManager in Player class
    */
   private inputs: Inputs = {
       turn: 0,
       jump: false,
       shifty: 0
    }
    
    /**
     * Shared data about the Player meant to be used by states and components
    */
   private data: StateData = {
       worldPosition: new Vector2D(128, 128),
       velocity: new Vector2D(0, 0),
       rotationRate: 0,

        height: 0,
        verticalVelocity: 0,
    
        shiftyTargetAngle: 0,
        shiftyAngle: 0   
    }
    
    // Components
    private shadow: Shadow;
    private snowboard: Snowboard;
    private body: Body;
    private tricksManager: TricksManager;

    constructor(parent: Parent) {
        super(parent);

        this.shadow = new Shadow(parent);
        this.snowboard = new Snowboard(this);
        this.body = new Body(this);

        this.setupInputs();

        this.tricksManager = new TricksManager(this);
        this.playerState  = new GroundState(this, this.tricksManager, this.inputs, this.settings, this.data);

        LayerManager.getLayer("snowboarder")?.attach(this.container);
    }

    // #region Miscellaneous

    private setupInputs() {
        InputManager.getInput("turn").subscribe((newValue) => {
            this.inputs.turn = newValue;
        });

        InputManager.getInput("jump").subscribe((newValue) => {
            this.inputs.jump = newValue;
        });

        InputManager.getInput("shifty").subscribe((newValue) => {
            this.inputs.turn = newValue;
        });
    }

    public reset() {
        this.data.worldPosition.set(new Vector2D(128, 128));
        this.data.velocity.set(new Vector2D(0, 0));
        this.rotation = 0;

        this.tricksManager.reset();
    }

    // #endregion

    // #region Collisions

    public onCollisionStart(other: SATCollider): void {
        if (other.layer === "obstacle") {
            if (this.data.velocity.magnitude() > 10) {
                Game.endGame("You crashed into an obstacle!");
            }
            
            this.data.velocity = this.data.velocity.multiply(-0.5);
        }

        // If we hit a jump and we're not already in the air, add some height and velocity - wont be used until we enter the air
        if (other.layer === "jump" && !this.InAir) {
            this.data.height += 1;
            this.data.verticalVelocity = this.data.velocity.magnitude() * 0.0075;
        }

        if (other.layer === "rail" ) {
            console.log("Hello rail");
        }
    }

    public onCollisionEnd(other: SATCollider): void {
        // At the end of a jump if the player isnt in the air, put them in the air
        if (other.layer === "jump" && !this.InAir) {
            this.InAir = true;
        }
    }

    // #endregion

    // #region Update

    public override update(deltaTime: number): void {
        if (this.inputs.jump && !this.InAir) { // Jump
            this.data.verticalVelocity += 4;
            this.InAir = true;
        };
        
        this.playerState.update(deltaTime);
        this.updatePhysics(deltaTime); // 2D physics

        this.scale = new Vector2D(1 + this.data.height * 0.15, 1 + this.data.height * 0.15);
        this.shadow.setEffects(this.data.height, this.snowboard.WorldRotation);

        super.update(deltaTime);
    }
    
    private updatePhysics(deltaTime: number) {
        const turnStrength = 250;

        this.rotation += this.data.rotationRate * deltaTime * turnStrength;

        // Update position
        this.data.worldPosition.set(
            this.data.worldPosition.add(this.data.velocity.multiply(deltaTime)),
        );
    }

    // #endregion

    // #region Getters & Setters

    public override get WorldPosition(): Vector2D {
        return this.data.worldPosition.clone();
    }

    public get InAir(): boolean {
        return this.inAir;
    }

    public set InAir(value: boolean) {
        if (this.inAir === value) return;

        this.inAir = value;
   
        if (this.inAir) {
            this.playerState.exit();
            this.playerState = new AirState(this, this.tricksManager, this.inputs, this.settings, this.data);
        } else {
            this.playerState.exit();
            this.playerState = new GroundState(this, this.tricksManager, this.inputs, this.settings, this.data);
        }     
    }

    public get PhysicalPosition(): Vector2D {
        return this.data.worldPosition.clone();
    }

    public get Velocity(): Vector2D {
        return this.data.velocity.clone();
    }

    // public set Velocity(value: Vector2D) {
    //     this.velocity = value.clone();
    // }

    public get BoardWorldRotation(): number {
        return this.snowboard.WorldRotation;
    }

    public set BoardRotation(value: number) {
        this.snowboard.Rotation = value;
    }

    public get BodyWorldRotation(): number {
        return this.body.WorldRotation;
    }

    public set BodyRotation(value: number) {
        this.body.Rotation = value;
    }

    // public get ShiftyInput(): number {
    //     return this.shiftyInput;
    // }

    // public get TurnInput(): number {
    //     return this.turnInput;
    // }

    // public get ShiftyTargetAngle(): number {
    //     return this.shiftyTargetAngle;
    // }

    // public set ShiftyTargetAngle(targetAngle: number) {
    //     this.shiftyTargetAngle = targetAngle;
    // }

    // public set ShiftyAngle(angle: number) {
    //     this.shiftyAngle = angle;
    // }

    // public get ShiftyAngle(): number {
    //     return this.shiftyAngle;
    // }    

    // public get ShiftyLerpSpeed(): number {
    //     return this.maxShiftyAngle;
    // }

    // public get MaxShiftyAngle(): number {
    //     return this.maxShiftyAngle;
    // }

    // public get VerticalVelocity(): number {
    //     return this.verticalVelocity;
    // }

    // public set VerticalVelocity(value: number) {
    //     this.verticalVelocity = value;
    // }

    // public get Height(): number {
    //     return this.height;
    // }

    // public set Height(value: number) {
    //     this.height = value;
    // }

    // public get RotationRate(): number {
    //     return this.rotationRate;
    // }

    // public set RotationRate(value: number) {
    //     this.rotationRate = value;
    // }

    // #endregion
}
