import { Assets, Point, Sprite } from "pixi.js";
import { GameObject, Parent } from "./GameObject.ts";

export class Snowboarder extends GameObject {
    private speed: number = 0;
    private turnInput: number = 0;

    constructor(
        parent: Parent,
    ) {
        super(parent, new Point(
            globalThis.window.innerWidth / 2, 
            globalThis.window.innerHeight / 2
        ), 0, new Point(2, 2));

        this.setSpeed(1);

        this.setupInputs();
    }

    private async setupInputs() {
        const { InputManager } = await import("client/inputs/InputManager.ts");

        InputManager.getInput("turn").subscribe((newValue) => {
            this.turnInput = newValue;
        });
    }

    protected  override async createSprite() {
        const headTexture = await Assets.load('/snowboarder/Head.png');
        headTexture.source.scaleMode = 'nearest';
        const headSprite = new Sprite(headTexture);
        
        const bodyTexture = await Assets.load('/snowboarder/Body.png');
        bodyTexture.source.scaleMode = 'nearest';
        const bodySprite = new Sprite(bodyTexture);
        
        const boardTexture = await Assets.load('/snowboarder/Board.png');
        boardTexture.source.scaleMode = 'nearest';
        const boardSprite = new Sprite(boardTexture);
        
        this.container.addChild(boardSprite);
        this.container.addChild(bodySprite);
        this.container.addChild(headSprite);

        super.createSprite();
    }

    public override update(deltaTime: number): void {
        // Update position based on speed and turn input
        const radians = (this.rotation) * (Math.PI / 180);
        this.position.x += Math.cos(radians) * this.speed * (deltaTime);
        this.position.y += Math.sin(radians) * this.speed * (deltaTime);
        this.rotation += this.turnInput * (deltaTime);

        super.update(deltaTime);
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }
    setTurnInput(turn: number) {
        this.turnInput = turn;
    }
}