import { GameObject } from "framework";

export class Head extends GameObject {
    public override get Name() { return "Head"; }
    protected override layer: string = "player";

    protected override start(): void {
        this.loadSprite("snowboarder/Head.png");
    }
}