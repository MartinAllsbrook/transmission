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
        await this.loadSprite("/jumps/SkiJump.png", 2);

        await super.createSprite();
    }
}