import { GameObject, Vector2D } from "framework";
import { Tree } from "./obstacles/Tree.ts";
import { Chunk } from "./Chunk.ts";

export class World extends GameObject {
    public override get Name() { return "World"; }

    private tree = new Tree(this, this.root, {
        position: new Vector2D(0, 0)
    });

    private readonly chunkSize: number = 256;

    private chunks: Map<[number, number], Chunk> = new Map();

    protected override start(): void {
        console.log("World started");
        console.log(this.chunks);
        this.createChunk(0, 0);

    }

    private createChunk(chunkX: number, chunkY: number): Chunk {
        const chunkKey: [number, number] = [chunkX, chunkY];
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