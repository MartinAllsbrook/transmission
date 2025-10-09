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
import { PlayerState } from "./states/PlayerState.ts";
import { GroundState } from "./states/GroundState.ts";
import { AirState } from "./states/AirState.ts";
  
export interface PlayerConfig {
    // Initialization
    startPosition: Vector2D;

    // 2D Physics
    frictionStrength: number;
    gravityStrength: number;
    slipStrength: number;
    
    // Rotation
    rotationSpeed: number;
    rotationStrength: number;

    // Height & Air
    gravityHeightStrength: number;
    jumpStrength: number;

    // Shifty
    shiftyLerpSpeed: number;
    shiftyMaxAngle: number;
}

export class PlayerInputs {
    turn: number = 0; // -1 to 1
    jump: boolean = false;
    shifty: number = 0; // -1 to 1
}

export class Snowboarder extends GameObject {
    private readonly config: PlayerConfig = {
        startPosition: new Vector2D(128, 128),

        frictionStrength: 0.1, // Raising this lowers top speed (max 1)
        gravityStrength: 140, // Raising this value makes the game feel faster
        slipStrength: 325, // Raising this value makes turning more responsive
        
        rotationSpeed: 250,
        rotationStrength: 10,

        gravityHeightStrength: 16,
        jumpStrength: 4,

        shiftyLerpSpeed: 3, // Higher is snappier
        shiftyMaxAngle: 90, // Degrees
    };

    private inputs: PlayerInputs = {
        turn: 0,
        jump: false,
        shifty: 0,
    }

    private state: PlayerState;
        
    private physicalPosition: Vector2D = this.config.startPosition.clone();
    private height: number = 0;

    private inAir: boolean = false;

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

        LayerManager.getLayer("snowboarder")?.attach(this.container);
        this.tricksManager = new TricksManager(this);

        this.state = new GroundState({
            player: this,
            body: this.body,
            head: this.body.Head,
            board: this.snowboard,
            tricksManager: this.tricksManager,
            inputs: this.inputs,
            config: this.config,
        });

        this.state.enter();
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
            this.inputs.shifty = newValue;
        });
    }

    public reset() {
        this.physicalPosition.set(new Vector2D(128, 128));
        this.rotation = 0;
        this.height = 0;
        this.inAir = false;

        this.state = new GroundState({
            player: this,
            body: this.body,
            head: this.body.Head,
            board: this.snowboard,
            tricksManager: this.tricksManager,
            inputs: this.inputs,
            config: this.config,
        });

        this.state.enter();

        this.tricksManager.reset();
    }

    // #endregion

    // #region Collisions

    public onCollisionStart(other: SATCollider): void {
        if (other.layer === "obstacle") {
            // if (this.velocity.magnitude() > 10) {
                Game.endGame("You crashed into an obstacle!");
            // }
            
            // this.velocity = this.velocity.multiply(-0.5);
        }

        // If we hit a jump and we're not already in the air, add some height and velocity - wont be used until we enter the air
        if (other.layer === "jump" && !this.InAir) {
            this.height += 1;
            // this.verticalVelocity = this.velocity.magnitude() * 0.0075;
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
        this.state.update(deltaTime);

        this.scale = new Vector2D(1 + this.height * 0.15, 1 + this.height * 0.15);
        this.shadow.setEffects(this.height, this.snowboard.WorldRotation);

        super.update(deltaTime);
    }

    // #endregion

    // #region Getters & Setters

    public set InAir(value: boolean) {
        if (this.inAir === value) return;

        this.inAir = value;
   
        if (this.inAir) {
            const shared = this.state.exit();

            this.state = new AirState({
                player: this,
                body: this.body,
                head: this.body.Head,
                board: this.snowboard,
                tricksManager: this.tricksManager,
                inputs: this.inputs,
                config: this.config,
            }, shared);

            this.state.enter();
        } else {
            const shared = this.state.exit();

            this.state = new GroundState({
                player: this,
                body: this.body,
                head: this.body.Head,
                board: this.snowboard,
                tricksManager: this.tricksManager,
                inputs: this.inputs,
                config: this.config,
            }, shared);

            this.state.enter();
        }     
    }

    public override get WorldPosition(): Vector2D {
        return this.physicalPosition.clone();
    }

    public get PhysicalPosition(): Vector2D {
        return this.physicalPosition;
    }

    public get Height(): number {
        return this.height;
    }

    public set Height(value: number) {
        this.height = value;
    }

    public get Velocity(): Vector2D {
        return this.state.Velocity;
    }

    // #endregion
}
