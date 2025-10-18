import { GameObject } from "framework";

export class Board extends GameObject {
    public override get Name(): string { return "Board"; }

    protected override start(): void {
        this.loadSprite("snowboarder/Board.png");
    }

}