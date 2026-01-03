import { GameObject, GameRoot, Transform, TransformOptions, Vector2D } from "framework";
import { SnowParticles } from "./SnowParticles.ts";

export class SnowLayer extends GameObject {
    public override get Name(): string {
        return `SnowLayer${this.index}`;
    }
    public override get layer(): string {
        return "snow";
    }

    private index: number;
    private chunkSize: number;

    // private chunks: SnowParticles[][] = [];

    private activeDistance: number = 1;

    private chunks: Map<string, SnowParticles> = new Map();
    private playerTransform: Transform;

    constructor(
        parent: GameObject | GameRoot,
        root: GameRoot,
        index: number, 
        chunkSize: number,
        playerTransform: Transform,
        transformOptions?: TransformOptions,
    ) {
        super(parent, root, transformOptions);

        this.index = index;
        this.chunkSize = chunkSize;
        this.playerTransform = playerTransform;
    }

    protected override start(): void {
        // Calculate the player's initial chunk position
        const relativePosition = this.playerTransform.WorldPosition.subtract(this.Transform.Position);
        const playerChunkPosition = relativePosition
            .multiply(1 / this.chunkSize)
            .floor();

        const playerChunkX = playerChunkPosition.x;
        const playerChunkY = playerChunkPosition.y;

        // Create chunks relative to the player's actual starting position
        for (let x = playerChunkX - this.activeDistance; x <= playerChunkX + this.activeDistance; x++) {
            for (let y = playerChunkY - this.activeDistance; y <= playerChunkY + this.activeDistance; y++) {
                this.createChunk(x, y);
            }
        }
    }

    public override update(deltaTime: number): void {
        const relativePosition = this.playerTransform.WorldPosition.subtract(this.Transform.Position); // The position of the player relative to this layer
        
        const playerChunkPosition = relativePosition
            .multiply(1 / this.chunkSize)
            .floor();

        const playerChunkX = playerChunkPosition.x;
        const playerChunkY = playerChunkPosition.y;

        // Unload chunks that are too far away
        const chunksToRemove: string[] = [];
        for (const [key, chunk] of this.chunks.entries()) {
            const [chunkX, chunkY] = key.split(",").map(Number);
            const distance = Math.max(
                Math.abs(chunkX - playerChunkX),
                Math.abs(chunkY - playerChunkY),
            );

            if (distance > this.activeDistance) {
                chunksToRemove.push(key);
                chunk.destroy();
            }
        }

        // Remove unloaded chunks from the map
        for (const key of chunksToRemove) {
            this.chunks.delete(key);
        }

        // Load chunks in area around player
        for (
            let x = playerChunkX - this.activeDistance;
            x <= playerChunkX + this.activeDistance;
            x++
        ) {
            for (
                let y = playerChunkY - this.activeDistance;
                y <= playerChunkY + this.activeDistance;
                y++
            ) {
                this.createChunk(x, y);
            }
        }

        super.update(deltaTime);
    }

    private createChunk(chunkX: number, chunkY: number): SnowParticles {
        const chunkKey = `${chunkX},${chunkY}`;

        if (this.chunks.has(chunkKey)) {
            return this.chunks.get(chunkKey)!;
        }

        const chunk = new SnowParticles(
            this,
            this.root,
            this.chunkSize,
            {
                position: new Vector2D(
                    chunkX * this.chunkSize,
                    chunkY * this.chunkSize,
                ),
            },
        );
        this.chunks.set(chunkKey, chunk);
        return chunk;
    }
}
