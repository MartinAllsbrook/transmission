import { Assets, Sprite } from "pixi.js";
import { GameObject } from "./GameObject.ts";
import { Vector2D } from "../math/Vector2D.ts";
import { RectCollider } from "../colliders/RectCollider.ts";

export class Jump extends GameObject {
    constructor(parent: GameObject, position: Vector2D) {
        super(parent, position);
        this.container.label = "Jump";

        new RectCollider(this, new Vector2D(0, 0), new Vector2D(48, 32), true, "jump");
    } 

    public override async createSprite() {
        const texture = await Assets.load("/jumps/SkiJump.png");
        texture.source.scaleMode = "nearest";
        const sprite = new Sprite(texture);
    
        sprite.scale = 2;

        this.container.addChild(sprite);

        await super.createSprite();
    }
}