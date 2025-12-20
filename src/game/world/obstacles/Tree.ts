import { CircleCollider, GameObject } from "framework";
import { Vector2D } from "../../../framework/math/Vector2D.ts";

export class Tree extends GameObject {
    public override get Name(): string {
        return "Tree";
    }

    protected override start(): void {
        this.loadSprite("obsticales/Tree.png", {
            anchor: new Vector2D(0.5, 0.925),
            scale: new Vector2D(2, 2.5),
        });

        new CircleCollider(this, { layer: "obstacle", radius: 8 });
    }
}
