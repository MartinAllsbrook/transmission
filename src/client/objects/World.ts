import { Container, Point } from "pixi.js";
import { GameObject } from "./GameObject.ts";
import { Obstacle } from "./Obstacle.ts";

export class World extends GameObject {
    private objects: GameObject[] = [];

    constructor(parent: Container) {
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
        
        const obstacle = new Obstacle(this.container, new Point(x, y));
        this.objects.push(obstacle);
    }

    public override update(deltaTime: number): void {
        console.log(this.position.x);
        this.position.y -= (deltaTime);
        
        super.update(deltaTime);
    }
}