import { GameObject } from "../GameObject.ts";
import { Snowboarder } from "./Snowboarder.ts";

export class Body extends GameObject {
    constructor(parent: Snowboarder) {
        super(parent);
        this.container.label = "Body";
    }

    public override async createSprite() {
        await this.loadSprite("/snowboarder/Body.png", 1);
        await super.createSprite();
    }
}