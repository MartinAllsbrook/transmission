import { GameObject, RectCollider, Vector2D } from "framework";
import { Player } from "./Player.ts";

export class Board extends GameObject {
    public override get Name(): string {
        return "Board";
    }
    public override get layer(): string {
        return "player";
    }

    protected override start(): void {
        this.loadSprite("snowboarder/Board.png");

        const collider = new RectCollider(this, {
            layer: "player",
            size: new Vector2D(33, 8),
        });

        collider.onCollisionEnter((collider) => {
            (this.parent as Player).onCollisionEnter(collider);
        });
        collider.onCollisionStay((collider) => {
            (this.parent as Player).onCollisionStay(collider);
        });
        collider.onCollisionExit((collider) => {
            (this.parent as Player).onCollisionExit(collider);
        });
    }
}
