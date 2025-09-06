import { Point } from "pixi.js";
import { GameObject, Parent } from "./GameObject.ts";
import { Obstacle } from "./Obstacle.ts";

export class World extends GameObject {

    private playerVelocity: Point = new Point(0, -1);
    private originOffset: Point = new Point(0, 0);

    constructor(parent: Parent) {
        super(parent, new Point(0, 0));

        // Create some random obstacles
        for (let i = 0; i < 10; i++) {
            this.createRandomObstacle();
        }
    }

    private createRandomObstacle() {
        const x = Math.random() * globalThis.window.innerWidth;
        console.log(globalThis.window.innerWidth);
        const y = Math.random() * globalThis.window.innerHeight;
        
        const obstacle = new Obstacle(this, new Point(x, y));
    }

    public override update(deltaTime: number): void {
        // Move world origin
        this.originOffset.x += this.playerVelocity.x * deltaTime;
        this.originOffset.y += this.playerVelocity.y * deltaTime;



        super.update(deltaTime);
    }
}