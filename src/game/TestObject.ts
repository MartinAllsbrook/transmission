import { GameObject } from "framework";

export class TestObject extends GameObject { 
    public override get Name() { return "TestObject"; }

    protected override start(): void {
        this.loadSprite("Warning.png");
    }
}