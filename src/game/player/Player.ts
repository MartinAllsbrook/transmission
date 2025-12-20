import { BooleanInput, ExtraMath, GameInstance, GameObject, SATCollider, ValueInput, Vector2D } from "framework";

import { Body } from "./Body.ts";
import { Board } from "./Board.ts";
import { PlayerState } from "./states/PlayerState.ts";
import { GroundState } from "./states/GroundState.ts";
import { Shadow } from "./Shadow.ts";
import { DebugStats } from "../ui/DebugStats.ts";

export class Player extends GameObject {
    public override get Name() { return "Player"; }
    public override get layer(): string { return "player"; }

    // Parts
    private board: Board = new Board(this, this.root);
    private body: Body = new Body(this, this.root);
    private shadow: Shadow = new Shadow(this, this.root); // Placeholder for shadow

    // Inputs
    private jumpInput = new BooleanInput("Jump", [" ", "w", "ArrowUp"]);
    private rotateInput = new ValueInput("Rotate", ["d"], ["a"]);
    private shiftyInput = new ValueInput("Shifty", ["ArrowLeft"], ["ArrowRight"]);

    // State
    private state: PlayerState = new GroundState(this);

    // Physics & Movement
    private velocity: Vector2D = new Vector2D(0, 0);
    private rotationSpeed: number = 0;
    private shiftyAngle: number = 0;

    private height: number = 0;
    private deltaHeight: number = 0;

    protected override start(): void {
        this.root.Camera.setParent(this);
    }
    
    protected override update(deltaTime: number): void {
        this.state.update(deltaTime);

        DebugStats.instance.updateStat("position", `(${this.Transform.WorldPosition.x.toFixed(2)}, ${this.Transform.WorldPosition.y.toFixed(2)})`);
        DebugStats.instance.updateStat("velocity", `(${this.Velocity.x.toFixed(2)}, ${this.Velocity.y.toFixed(2)})`);
        DebugStats.instance.updateStat("rotation", `${ExtraMath.radToDeg(this.Transform.Rotation).toFixed(2)}°`);
        DebugStats.instance.updateStat("height", this.Height.toFixed(2));

        this.Transform.Scale = new Vector2D(1, 1).multiply(1 + (this.height * 0.5));
    }

    protected override reset(): void {
        console.log("Resetting Player");

        this.Transform.Position = new Vector2D(0, 0);
        this.Transform.Rotation = 0;

        this.velocity = new Vector2D(0, 0);
        this.rotationSpeed = 0;
        this.shiftyAngle = 0;
        this.height = 0;
        this.deltaHeight = 0;
        this.state = new GroundState(this);
        this.state.enter();
    }

    public changeState(newState: PlayerState): void {
        this.state.exit();
        this.state = newState;
        this.state.enter();
    }

    //#region Collision Handling

    public onCollisionEnter(other: SATCollider): void {
        if (other.layer === "obstacle") {
            GameInstance.instance.endGame("You crashed into an tree, watch out!");
        }

        this.state.onCollisionEnter(other);
    }

    public onCollisionStay(other: SATCollider): void {
        this.state.onCollisionStay(other);
    }

    public onCollisionExit(other: SATCollider): void {
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

    public set RotationSpeed(rotationSpeed: number) {
        this.rotationSpeed = rotationSpeed;
    }

    public get RotationSpeed(): number {
        return this.rotationSpeed;
    }

    public set ShiftyAngle(shiftyAngle: number) {
        this.shiftyAngle = shiftyAngle;
    }

    public get ShiftyAngle(): number {
        return this.shiftyAngle;
    }

    public set Height(height: number) {
        this.height = height;
    }

    public get Height(): number {
        return this.height;
    }

    public set DeltaHeight(deltaHeight: number) {
        this.deltaHeight = deltaHeight;
    }

    public get DeltaHeight(): number {
        return this.deltaHeight;
    }

    public get InAir(): boolean {
        return this.state.StateName === "air";
    }

    //#endregion
}