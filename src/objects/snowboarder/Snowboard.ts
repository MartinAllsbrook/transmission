import { RectCollider } from "../../colliders/RectCollider.ts";
import { Vector2D } from "../../math/Vector2D.ts";
import { GameObject } from "../GameObject.ts";
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
        await this.loadSprite("/snowboarder/Board.png", 1);
        
        await super.createSprite();
    }

    private setupCollider() {
        const collider = new RectCollider(
            this,
            new Vector2D(0, 0),
            new Vector2D(32, 7),
            false,
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