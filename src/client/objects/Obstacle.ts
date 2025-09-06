import { Assets, Point, Sprite } from "pixi.js";
import { GameObject, Parent } from "./GameObject.ts";

export class Obstacle extends GameObject {
    constructor(
        parent: Parent,
        position: Point,
    ) {
        super(parent, position, 0, new Point(2, 2));

        this.createSprite();
    }

    protected override async createSprite() {    
        const treeTexture = await Assets.load('/obsticales/Tree.png');
        treeTexture.source.scaleMode = 'nearest';
        const treeSprite = new Sprite(treeTexture);
        this.container.addChild(treeSprite);

        super.createSprite();
    }

}