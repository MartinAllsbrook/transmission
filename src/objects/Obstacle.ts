import { Assets, Sprite } from "pixi.js";
import { GameObject, Parent } from "src/objects/GameObject.ts";
import { CircleCollider } from "src/colliders/CircleCollider.ts";
import { Vector2D } from "src/math/Vector2D.ts";

export class Obstacle extends GameObject {
    constructor(
        parent: Parent,
        position: Vector2D,
    ) {
        super(parent, position, new Vector2D(32, 32));

        this.createSprite();
    }

    protected override async createSprite() {
        const treeTexture = await Assets.load("/obsticales/Tree.png");
        treeTexture.source.scaleMode = "nearest";
        const treeSprite = new Sprite(treeTexture);
        this.container.addChild(treeSprite);

        super.createSprite();

        const collider = new CircleCollider(this, new Vector2D(0, 12), 4, true);
    }
}
