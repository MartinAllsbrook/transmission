import { Assets, Sprite } from "pixi.js";
import { GameObject, Parent } from "./GameObject.ts";
import { RectCollider } from "../colliders/RectCollider.ts";
import { Vector2D } from "../math/Vector2D.ts";
import { Signal } from "@preact/signals";

export class Snowboarder extends GameObject {
    /** Current speed of the player */
    private speed: number = 0;

    /** Input value for turning, from -1 to 1 */
    private turnInput: number = 0;

    /** The position of the player in the world, used for world scrolling */
    public worldPosition: Vector2D = new Vector2D(0, 0);

    /** A set of stats to be acessed by the game UI */
    private stats: {
        speed: Signal<number>;
        distance: Signal<number>;
        score: Signal<number>;
    };

    constructor(
        parent: Parent,
        stats: {
            speed: Signal<number>;
            distance: Signal<number>;
            score: Signal<number>;
        }
    ) {
        super(
            parent,
            new Vector2D(0, 0),
            new Vector2D(32, 32),
            0,
            new Vector2D(1, 1),
        );

        this.stats = stats;

        this.setSpeed(1);

        this.setupInputs();
    }

    private async setupInputs() {
        const { InputManager } = await import("src/inputs/InputManager.ts");

        InputManager.getInput("turn").subscribe((newValue) => {
            this.turnInput = newValue;
        });
    }

    protected override async createSprite() {
        const headTexture = await Assets.load("/snowboarder/Head.png");
        headTexture.source.scaleMode = "nearest";
        const headSprite = new Sprite(headTexture);

        const bodyTexture = await Assets.load("/snowboarder/Body.png");
        bodyTexture.source.scaleMode = "nearest";
        const bodySprite = new Sprite(bodyTexture);

        const boardTexture = await Assets.load("/snowboarder/Board.png");
        boardTexture.source.scaleMode = "nearest";
        const boardSprite = new Sprite(boardTexture);

        this.container.addChild(boardSprite);
        this.container.addChild(bodySprite);
        this.container.addChild(headSprite);

        super.createSprite();

        const _collider = new RectCollider(
            this,
            new Vector2D(0, 0),
            new Vector2D(32, 7),
            true,
            "player",
        );

        console.log(
            `Snowboarder size \n: Width: ${this.container.width}, Height: ${this.container.height}`,
        );
    }

    public override update(deltaTime: number): void {
        // Update position based on speed and turn input
        const radians = (this.rotation) * (Math.PI / 180);
        this.worldPosition.x += Math.cos(radians) * this.speed * deltaTime;
        this.worldPosition.y += Math.sin(radians) * this.speed * deltaTime;
        this.rotation += this.turnInput * deltaTime;

        this.updateStats();

        super.update(deltaTime);
    }

    private updateStats() {
        this.stats.speed.value = this.speed;
        this.stats.distance.value = this.worldPosition.y;
        this.stats.score.value = Math.floor(this.worldPosition.y / 10);
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }
    setTurnInput(turn: number) {
        this.turnInput = turn;
    }
}
