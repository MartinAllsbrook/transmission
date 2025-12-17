import { GameObject, GameRoot, Vector2D, TransformOptions, Transform } from "framework";
import { Chunk } from "./Chunk.ts";
import { Trail } from "./trails/Trail.ts";

export class World extends GameObject {
    public override get Name() { return "World"; }

    private readonly chunkSize: number = 256;

    private playerTransform: Transform;

    private chunks: Map<string, Chunk> = new Map();

    private trail: Trail = new Trail(this, this.root);

    private chunksActiveDistance: number = 4;
    private runsActiveDistance: number = 8;

    constructor(
        parent: GameObject | GameRoot,
        root: GameRoot,
        playerTransform: Transform,
        transformOptions?: TransformOptions
    ) {
        super(parent, root, transformOptions);
    
        this.playerTransform = playerTransform;
    }

    protected override start(): void {
        this.createChunk(0, 0);
    }

    protected override update(_deltaTime: number): void {
        this.updateChunks();
        this.updateTrail();
    }

    public distanceToTrail(position: Vector2D): number {
        return this.trail.getDistanceToTrail(position);
    }

    private updateTrail(): void {
        const runsActiveDistance = this.runsActiveDistance * this.chunkSize;

        const lowerBound = (runsActiveDistance * -1) + this.playerTransform.WorldPosition.y;
        const upperBound = (runsActiveDistance) + this.playerTransform.WorldPosition.y;
        
        if (this.trail.getLastPoint().y < lowerBound) {
            this.trail.shortenTrail();
        }

        if (this.trail.getFirstPoint().y < upperBound) {
            this.trail.extendTrail();
        }
    }

    /**
     * Updates the loaded chunks based on the player's position.
     */
    private updateChunks(): void {
        const playerPosition = this.playerTransform?.WorldPosition;
        const playerChunkPosition = playerPosition
            .multiply(1 / this.chunkSize)
            .floor();
        
        const playerChunkX = playerChunkPosition.x;
        const playerChunkY = playerChunkPosition.y;
        
        // Unload chunks that are too far away (beyond 2 chunks)
        const chunksToRemove: string[] = [];
        for (const [key, chunk] of this.chunks.entries()) {
            const [chunkX, chunkY] = key.split(',').map(Number);
            const distance = Math.max(
                Math.abs(chunkX - playerChunkX),
                Math.abs(chunkY - playerChunkY)
            );
            
            if (distance > this.chunksActiveDistance) {
                chunksToRemove.push(key);
                chunk.destroy();
            }
        }
        
        // Remove unloaded chunks from the map
        for (const key of chunksToRemove) {
            this.chunks.delete(key);
        }
        
        // Load chunks in 5x5 area around player (2 chunks in each direction)
        for (let x = playerChunkX - this.chunksActiveDistance; x <= playerChunkX + this.chunksActiveDistance; x++) {
            for (let y = playerChunkY - this.chunksActiveDistance; y <= playerChunkY + this.chunksActiveDistance; y++) {
                this.createChunk(x, y);
            }
        }
    }

    private createChunk(chunkX: number, chunkY: number): Chunk {
        const chunkKey = `${chunkX},${chunkY}`;
        
        if (this.chunks.has(chunkKey)) {
            return this.chunks.get(chunkKey)!;
        }
        
        const chunk = new Chunk(this, this.root, this.chunkSize, {
            position: new Vector2D(
                chunkX * this.chunkSize,
                chunkY * this.chunkSize
            )
        });
        this.chunks.set(chunkKey, chunk);
        return chunk;
    }
}