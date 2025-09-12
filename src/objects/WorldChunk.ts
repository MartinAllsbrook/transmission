import { Graphics } from "pixi.js";
import { GameObject, Parent } from "src/objects/GameObject.ts";
import { Obstacle } from "src/objects/Obstacle.ts";
import { Vector2D } from "src/math/Vector2D.ts";

export class WorldChunk extends GameObject {
    chunkPosition: Vector2D;

    constructor(
        parent: Parent,
        position: Vector2D,
        chunkPosition: Vector2D,
        size: Vector2D,
    ) {
        super(parent, position, size);

        this.chunkPosition = chunkPosition;
        this.size = size;

        this.createChunk();
    }

    private createChunk(): void {
        super.createSprite();
        
        for (let i = 0; i < 5; i++) {
            this.createRandomObstacle();
        }

        // Use actual chunk size
        const width = this.size?.x ?? 64;
        const height = this.size?.y ?? 64;

        const graphics = new Graphics()
            .rect(0, 0, width, height)
            .stroke({ width: 2, color: 0x000000 });
        
        this.container.addChild(graphics);


    }

    private createRandomObstacle() {
        const x = Math.random() * this.size.x;
        const y = Math.random() * this.size.y;

        new Obstacle(this, new Vector2D(x, y));
    }
}
