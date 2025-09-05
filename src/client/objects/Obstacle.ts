import { Assets, Container, Point, Sprite } from "pixi.js";
import { GameObject } from "./GameObject.ts";

export class Obstacle extends GameObject {
    constructor(
        parent: Container,
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