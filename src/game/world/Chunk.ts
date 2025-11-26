import { GameObject, GameRoot, Vector2D } from "framework";
import { TransformOptions } from "../../framework/Transform.ts";
import { Tree } from "./obstacles/Tree.ts";

export class Chunk extends GameObject {
    public override get Name() { return "Chunk"; }

    private chunkSize: number;

    constructor(
        parent: GameObject | GameRoot,
        root: GameRoot,
        chunkSize: number,
        transformOptions?: TransformOptions
    ) {
        super(parent, root, transformOptions);
    
        this.chunkSize = chunkSize;

        // For demonstration, create 5 random obstacles in the chunk
        for (let i = 0; i < 5; i++) {
            this.createRandomObstacle();
        }
    }
    
    private createRandomObstacle() {
        // Generate random position within chunk
        const position = new Vector2D(
            Math.random() * this.chunkSize,
            Math.random() * this.chunkSize
        );

        // Create obstacle at position
        new Tree(this, this.root, { position });
    }
}