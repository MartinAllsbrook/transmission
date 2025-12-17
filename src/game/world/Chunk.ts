import { GameObject, GameRoot, Vector2D, TransformOptions } from "framework";
import { Tree } from "./obstacles/Tree.ts";
import { Jump } from "./features/Jump.ts";
import { World } from "./World.ts";

export class Chunk extends GameObject {
    public override get Name() { return "Chunk"; }

    private chunkSize: number;
    private world: World;

    constructor(
        parent: World,
        root: GameRoot,
        chunkSize: number,
        transformOptions?: TransformOptions
    ) {
        super(parent, root, transformOptions);
    
        this.chunkSize = chunkSize;
        this.world = parent;

        // For demonstration, create 5 random obstacles in the chunk
        for (let i = 0; i < 10; i++) {
            this.createRandomObstacle();
        }
    }
    
    private createRandomObstacle() {
        // Generate random position within chunk
        const position = new Vector2D(
            Math.random() * this.chunkSize,
            Math.random() * this.chunkSize
        );

        if (this.world.distanceToTrail(position.add(this.Transform.WorldPosition)) < 200) {
            // Too close to trail, skip placing an obstacle here
            return;
        }

        if ( Math.random() < 0.2 ) { 
            new Jump(this, this.root, { position });
        } else {
            new Tree(this, this.root, { position });
        }
    }
}