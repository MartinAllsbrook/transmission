import { GameObject } from "framework";

export class Head extends GameObject {
    public override get Name() { return "Head"; }
    public override get layer(): string { return "player"; }

    protected override start(): void {
        this.loadSprite("snowboarder/Head.png");
    }
}