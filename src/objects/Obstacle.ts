import { Assets, Sprite } from "pixi.js";
import { GameObject, Parent } from "src/objects/GameObject.ts";
import { CircleCollider } from "src/colliders/CircleCollider.ts";
import { Vector2D } from "src/math/Vector2D.ts";

export class Obstacle extends GameObject {
    constructor(
        parent: Parent,
        position: Vector2D,
    ) {
        super(parent, position);
    }

    public override async createSprite() {
        await this.loadSprite("/obsticales/Tree.png", 1.75);

        await super.createSprite();

        const _collider = new CircleCollider(
            this,
            new Vector2D(0, 22),
            6,
            true,
            "obstacle",
        );
    }
}
