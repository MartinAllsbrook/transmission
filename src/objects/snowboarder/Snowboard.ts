import Game from "islands/Game.tsx";
import { RectCollider } from "../../colliders/RectCollider.ts";
import { Vector2D } from "../../math/Vector2D.ts";
import { GameObject, Parent } from "../GameObject.ts";
import { Assets, Sprite } from "pixi.js";
import { Snowboarder } from "./Snowboarder.ts"

export class Snowboard extends GameObject {
    private snowboarder: Snowboarder;

    constructor(parent: Snowboarder) {
        super(parent);
        this.container.label = "Snowboard";
        
        this.snowboarder = parent;
        this.setupCollider();
    }

    public override async createSprite() {
        const texture = await Assets.load("/snowboarder/Board.png");
        texture.source.scaleMode = "nearest";
        const sprite = new Sprite(texture);

        this.container.addChild(sprite);

        
        await super.createSprite();
    }

    private setupCollider() {
        const collider = new RectCollider(
            this,
            new Vector2D(0, 0),
            new Vector2D(32, 7),
            true,
            "player",
        );

        collider.onCollisionStart((other) => {
            this.snowboarder.onCollisionStart(other);
        });

        collider.onCollisionEnd((other) => {
            this.snowboarder.onCollisionEnd(other);
        });
    }
}