import { Assets, Point, Sprite } from "pixi.js";
import { GameObject, Parent } from "./GameObject.ts";
import { CircleCollider } from "../colliders/CircleCollider.ts";

export class Obstacle extends GameObject {
    constructor(
        parent: Parent,
        position: Point,
    ) {
        super(parent, position, new Point(32, 32));

        this.createSprite();
    }

    protected override async createSprite() {
        const treeTexture = await Assets.load("/obsticales/Tree.png");
        treeTexture.source.scaleMode = "nearest";
        const treeSprite = new Sprite(treeTexture);
        this.container.addChild(treeSprite);

        super.createSprite();

        const collider = new CircleCollider(this, new Point(0, 12), 4, true);
    }
}
