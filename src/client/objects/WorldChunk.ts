import { Graphics, Point } from "pixi.js";
import { GameObject, Parent } from "./GameObject.ts";
import { Obstacle } from "./Obstacle.ts";

export class WorldChunk extends GameObject {
    chunkPosition: Point;

    constructor(
        parent: Parent,
        position: Point,
        chunkPosition: Point,
        size: Point,
    ) {
        super(parent, position, size);

        this.chunkPosition = chunkPosition;
        this.size = size;

        this.createChunk();
    }

    private createChunk(): void {
        // Draw a rectangle around the object using Pixi.js Graphics

        // Use actual chunk size
        const width = this.size?.x ?? 64;
        const height = this.size?.y ?? 64;

        const graphics = new Graphics()
            .rect(0, 0, width, height)
            .stroke({ width: 2, color: 0x000000 });
        this.container.addChild(graphics);

        for (let i = 0; i < 5; i++) {
            this.createRandomObstacle();
        }

        super.createSprite();
    }

    private createRandomObstacle() {
        const x = Math.random() * this.size.x;
        const y = Math.random() * this.size.y;

        new Obstacle(this, new Point(x, y));
    }
}
