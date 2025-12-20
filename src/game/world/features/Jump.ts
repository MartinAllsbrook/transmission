import { GameObject, Vector2D } from "framework";
import { RectCollider } from "../../../framework/colliders/RectCollider.ts";

export class Jump extends GameObject {
    public override get Name() {
        return "Jump";
    }

    protected override start(): void {
        this.loadSprite("/jumps/SkiJump.png", {
            anchor: new Vector2D(0.5, 0.925),
            scale: new Vector2D(2, 2.5),
        });

        new RectCollider(this, {
            layer: "jump",
            size: new Vector2D(48, 32),
            position: new Vector2D(0, -32),
        });
    }
}
