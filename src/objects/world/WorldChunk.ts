import { Graphics } from "pixi.js";
import { GameObject } from "src/objects/GameObject.ts";
import { Obstacle } from "src/objects/world/Obstacle.ts";
import { Vector2D } from "src/math/Vector2D.ts";
import { Jump } from "./Jump.ts";
import { World } from "./World.ts";

export class WorldChunk extends GameObject {
    chunkPosition: Vector2D;

    private world: World

    private size: Vector2D;

    constructor(
        world: World,
        position: Vector2D,
        chunkPosition: Vector2D,
        chunkSize: Vector2D = new Vector2D(256, 256),
    ) {
        super(world, position);

        this.world = world;
        this.chunkPosition = chunkPosition;
        this.size = chunkSize;
        this.createChunk();
    }

    private createChunk(): void {

        if (Math.random() < 0.1) {
            this.createRandomJump();
        }

        for (let i = 0; i < 4; i++) {
            this.createRandomObstacle();
        }

    }

    private createRandomObstacle() {
        const x = Math.random() * this.size.x;
        const y = Math.random() * this.size.y;

        const worldPosition = this.WorldPosition.add(new Vector2D(x, y));

        if (this.world.distanceToTrail(worldPosition) < 192) {
            return;
        }

        new Obstacle(this, new Vector2D(x, y));
    }

    private createRandomJump() {
        const x = Math.random() * this.size.x;
        const y = Math.random() * this.size.y;

        new Jump(this, new Vector2D(x, y));
    }

    protected override async createOwnSprites(): Promise<void> {
        await Promise.resolve(); // Ensure async context
        
        // Use actual chunk size
        // const width = this.size?.x ?? 64;
        // const height = this.size?.y ?? 64;

        // const graphics = new Graphics()
        //     .rect(0, 0, width, height)
        //     .stroke({ width: 2, color: 0x000000, alpha: 0.05 });

        // this.container.addChild(graphics);
    }
}
