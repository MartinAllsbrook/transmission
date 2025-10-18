import { GameObject } from "framework";

export class TestObject extends GameObject {
    protected override Start(): void {
        this.loadSprite("Warning.png")

        this.root.Camera.setParent(this);
    }
}