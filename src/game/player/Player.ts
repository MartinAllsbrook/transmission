import { BooleanInput, GameObject, ValueInput } from "framework";

import { Body } from "./Body.ts";
import { Board } from "./Board.ts";
import { PlayerState } from "./states/PlayerState.ts";
import { GroundState } from "./states/GroundState.ts";

export class Player extends GameObject {
    public override get Name() { return "Player"; }

    private board: Board = new Board(this, this.root);
    private body: Body = new Body(this, this.root);

    private jumpInput = new BooleanInput("Jump", ["Space", "W"]);
    private rotateInput = new ValueInput("Rotate", ["A"], ["D"]);
    private shiftyInput = new ValueInput("Shifty", ["ArrowLeft"], ["ArrowRight"]);

    protected override start(): void {
        this.root.Camera.setParent(this);
    }
    
    protected override update(deltaTime: number): void {
        
    }
}