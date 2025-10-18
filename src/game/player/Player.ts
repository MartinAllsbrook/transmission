import { BooleanInput, GameObject, SATCollider, ValueInput, Vector2D } from "framework";

import { Body } from "./Body.ts";
import { Board } from "./Board.ts";
import { PlayerState } from "./states/PlayerState.ts";
import { GroundState } from "./states/GroundState.ts";
import { Angle } from "../../framework/math/Angle.ts";

export class Player extends GameObject {
    public override get Name() { return "Player"; }

    // Parts
    private board: Board = new Board(this, this.root);
    private body: Body = new Body(this, this.root);

    // Inputs
    private jumpInput = new BooleanInput("Jump", ["Space", "w"]);
    private rotateInput = new ValueInput("Rotate", ["d"], ["a"]);
    private shiftyInput = new ValueInput("Shifty", ["ArrowLeft"], ["ArrowRight"]);

    // State
    private state: PlayerState = new GroundState(this);

    // Physics & Movement
    private velocity: Vector2D = new Vector2D(0, 0);
    private rotationSpeed: Angle = new Angle(0);
    private shiftyAngle: Angle = new Angle(0);

    protected override start(): void {
        this.root.Camera.setParent(this);
    }
    
    protected override update(deltaTime: number): void {
        this.state.update(deltaTime);
    }

    //#region Collison Handling

    public onCollisionEnter(other: SATCollider): void {
        console.log("Enter");

        this.state.onCollisionEnter(other);
    }

    public onCollisionStay(other: SATCollider): void {
        console.log("Stay");
        
        this.state.onCollisionStay(other);
    }

    public onCollisionExit(other: SATCollider): void {
        console.log("Exit");
        
        this.state.onCollisionExit(other);
    }

    //#endregion

    //#region Getters & Setters

    public get ShiftyInput(): ValueInput {
        return this.shiftyInput;
    }

    public get RotationInput(): ValueInput {
        return this.rotateInput;
    }

    public get JumpInput(): BooleanInput {
        return this.jumpInput;
    }

    public set Velocity(velocity: Vector2D) {
        this.velocity = velocity;
    }

    public get Velocity(): Vector2D {
        return this.velocity;
    }

    public set RotationSpeed(rotationSpeed: Angle) {
        this.rotationSpeed = rotationSpeed;
    }

    public get RotationSpeed(): Angle {
        return this.rotationSpeed;
    }

    public set ShiftyAngle(shiftyAngle: Angle) {
        this.shiftyAngle = shiftyAngle;
    }

    public get ShiftyAngle(): Angle {
        return this.shiftyAngle;
    }

    //#endregion
}