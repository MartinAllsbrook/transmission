import { GameObject, Parent } from "../GameObject.ts";
import { Vector2D } from "../../math/Vector2D.ts";
import Game from "islands/Game.tsx";
import { LayerManager } from "../../rendering/LayerManager.ts";
import { SATCollider } from "../../colliders/SATCollider.ts";
import { Snowboard } from "./Snowboard.ts";
import { Body } from "./Body.ts";
import { ExtraMath } from "../../math/ExtraMath.ts";
import { Shadow } from "./Shadow.ts";
import { InputManager } from "../../inputs/InputManager.ts";
import { TricksManager } from "./TricksManager.ts";
import { State } from "./states/State.ts";
import { GroundState } from "./states/GroundState.ts";
import { AirState } from "./states/AirState.ts";
  
export class Snowboarder extends GameObject {
    // Inputs
    private turnInput: number = 0;
    private jumpInput: boolean = false;
    private shiftyInput: number = 0;
        
    /** The position of the player in the world, used for world scrolling */
    
    // Physics & State
    private rotationRate: number = 0;
    
    private inAir = false;
    
    private state: State;

    // Shifty
    public worldPosition: Vector2D = new Vector2D(128, 128);
    private velocity: Vector2D = new Vector2D(0, 0);
    private height: number = 0;
    private verticalVelocity: number = 0;
    private shiftyTargetAngle: number = 0;
    private shiftyAngle: number = 0;    
    private shiftyLerpSpeed: number = 3;
    private maxShiftyAngle: number = 90;
    
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
        this.state  = new GroundState(this, this.tricksManager);

        LayerManager.getLayer("snowboarder")?.attach(this.container);
    }

    // #region Miscellaneous

    private setupInputs() {
        InputManager.getInput("turn").subscribe((newValue) => {
            this.turnInput = newValue;
        });

        InputManager.getInput("jump").subscribe((newValue) => {
            this.jumpInput = newValue;
        });

        InputManager.getInput("shifty").subscribe((newValue) => {
            this.shiftyInput = newValue;
        });
    }

    public reset() {
        this.worldPosition.set(new Vector2D(128, 128));
        this.velocity.set(new Vector2D(0, 0));
        this.rotation = 0;

        this.tricksManager.reset();
    }

    // #endregion

    // #region Collisions

    public onCollisionStart(other: SATCollider): void {
        if (other.layer === "obstacle") {
            if (this.velocity.magnitude() > 10) {
                Game.endGame("You crashed into an obstacle!");
            }
            
            this.velocity = this.velocity.multiply(-0.5);
        }

        // If we hit a jump and we're not already in the air, add some height and velocity - wont be used until we enter the air
        if (other.layer === "jump" && !this.InAir) {
            this.height += 1;
            this.verticalVelocity = this.velocity.magnitude() * 0.0075;
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
        if (this.jumpInput && !this.InAir) { // Jump
            this.verticalVelocity += 4;
            this.InAir = true;
        };
        
        this.state.update(deltaTime);
        this.updatePhysics(deltaTime); // 2D physics

        this.scale = new Vector2D(1 + this.height * 0.15, 1 + this.height * 0.15);
        this.shadow.setEffects(this.height, this.snowboard.WorldRotation);

        super.update(deltaTime);
    }
    
    private updatePhysics(deltaTime: number) {
        const turnStrength = 250;

        this.rotation += this.rotationRate * deltaTime * turnStrength;

        // Update position
        this.worldPosition.set(
            this.worldPosition.add(this.velocity.multiply(deltaTime)),
        );
    }

    // #endregion

    // #region Getters & Setters

    public override get WorldPosition(): Vector2D {
        return this.worldPosition.clone();
    }

    public get InAir(): boolean {
        return this.inAir;
    }

    public set InAir(value: boolean) {
        if (this.inAir === value) return;

        this.inAir = value;
   
        if (this.inAir) {
            this.state.exit();
            this.state = new AirState(this, this.tricksManager);
        } else {
            this.state.exit();
            this.state = new GroundState(this, this.tricksManager);
        }     
    }

    public get Velocity(): Vector2D {
        return this.velocity.clone();
    }

    public set Velocity(value: Vector2D) {
        this.velocity = value.clone();
    }

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

    public get ShiftyInput(): number {
        return this.shiftyInput;
    }

    public get TurnInput(): number {
        return this.turnInput;
    }

    public get ShiftyTargetAngle(): number {
        return this.shiftyTargetAngle;
    }

    public set ShiftyTargetAngle(targetAngle: number) {
        this.shiftyTargetAngle = targetAngle;
    }

    public set ShiftyAngle(angle: number) {
        this.shiftyAngle = angle;
    }

    public get ShiftyAngle(): number {
        return this.shiftyAngle;
    }    

    public get ShiftyLerpSpeed(): number {
        return this.maxShiftyAngle;
    }

    public get MaxShiftyAngle(): number {
        return this.maxShiftyAngle;
    }

    public get VerticalVelocity(): number {
        return this.verticalVelocity;
    }

    public set VerticalVelocity(value: number) {
        this.verticalVelocity = value;
    }

    public get Height(): number {
        return this.height;
    }

    public set Height(value: number) {
        this.height = value;
    }

    public get RotationRate(): number {
        return this.rotationRate;
    }

    public set RotationRate(value: number) {
        this.rotationRate = value;
    }

    // #endregion
}
