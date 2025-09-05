import { Assets, Container, Point, Sprite } from "pixi.js";
import { GameObject } from "./GameObject.ts";

export class Snowboarder extends GameObject {
    private speed: number = 0;
    private turnInput: number = 0;

    constructor(
        parent: Container,
    ) {
        super(parent, new Point(
            globalThis.window.innerWidth / 2, 
            globalThis.window.innerHeight / 2
        ));

        this.setSpeed(1);

        this.setupInputs();

        this.createSprite();

    }

    private async setupInputs() {
        const { InputManager } = await import("client/inputs/InputManager.ts");

        InputManager.getInput("turn").subscribe((newValue) => {
            this.turnInput = newValue;
        });
    }

    private async createSprite() {
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

        this.container.pivot.x = this.container.width / 2;
        this.container.pivot.y = this.container.height / 2;

        this.container.scale.set(2.5, 2.5);
    }

    update(deltaTime: number): void {
        // Update position based on speed and turn input
        const radians = (this.rotation - 90) * (Math.PI / 180);
        this.position.x += Math.cos(radians) * this.speed * (deltaTime / 16.67);
        this.position.y += Math.sin(radians) * this.speed * (deltaTime / 16.67);
        this.rotation += this.turnInput * (deltaTime / 16.67);
        this.container.position.set(this.position.x, this.position.y);
        this.container.rotation = this.rotation * (Math.PI / 180);
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }
    setTurnInput(turn: number) {
        this.turnInput = turn;
    }
}