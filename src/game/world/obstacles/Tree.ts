import { CircleCollider, GameObject } from "framework";
import { Vector2D } from "../../../framework/math/Vector2D.ts";

export class Tree extends GameObject {
    public override get Name(): string {
        return "Tree";
    }

    protected override start(): void {
        this.loadSprite("obsticales/Tree.png");

        new CircleCollider(this, "obstacle", 16, new Vector2D(0, 0));
    }
}