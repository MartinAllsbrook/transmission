import { BooleanInput, GameObject, ValueInput, Vector2D } from "framework";

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
    private jumpInput = new BooleanInput("Jump", ["Space", "W"]);
    private rotateInput = new ValueInput("Rotate", ["A"], ["D"]);
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


}