import { Assets, Sprite } from "pixi.js";
import { GameObject, Parent } from "./GameObject.ts";
import { RectCollider } from "../colliders/RectCollider.ts";
import { Vector2D } from "../math/Vector2D.ts";

export class Snowboarder extends GameObject {
    private speed: number = 0;
    private turnInput: number = 0;

    worldPosition: Vector2D = new Vector2D(0, 0);

    constructor(
        parent: Parent,
    ) {
        super(parent, new Vector2D(0, 0), new Vector2D(32, 32), 0, new Vector2D(1, 1));

        this.setSpeed(0);

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

        super.update(deltaTime);
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }
    setTurnInput(turn: number) {
        this.turnInput = turn;
    }
}
