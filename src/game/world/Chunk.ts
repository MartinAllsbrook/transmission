import { GameObject, GameRoot, Vector2D, TransformOptions, BlueNoise } from "framework";
import { Tree } from "./obstacles/Tree.ts";
import { Jump } from "./features/Jump.ts";
import { World } from "./World.ts";
import { Graphics } from "pixi.js";

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
    }

    protected override start(): void {
        const start = Date.now();

        const treePoints = BlueNoise.generate(
            new Vector2D(0, 0),
            new Vector2D(this.chunkSize, this.chunkSize),
            90,
        );

        for (const point of treePoints) {
            // Ensure trees are not too close to the trail
            const distanceToTrail = this.world.distanceToTrail(point.add(this.Transform.WorldPosition))
            if (distanceToTrail >= 200) {
                console.log(`Placing tree, Chunk Position: ${this.Transform.WorldPosition.X.toFixed(0)} ${this.Transform.WorldPosition.Y.toFixed(0)}`);
                new Tree(this, this.root, { position: point });
            }
        }

        // Create jump
        const chunkCenter = this.Transform.WorldPosition.add(new Vector2D(this.chunkSize / 2, this.chunkSize / 2));
        if (this.world.distanceToTrail(chunkCenter) < this.chunkSize / 2) {
            const jumpPosition = this.world.closestPointOnTrail(chunkCenter);
            if (jumpPosition) {
                new Jump(this, this.root, { position: jumpPosition.subtract(this.Transform.WorldPosition) });
            }
        } 

        const end = Date.now();
        const time = end - start;
        console.log(`Chunk generated in ${time} ms with ${treePoints.length} trees. (${(time / treePoints.length).toFixed(2)} ms/tree)`);

        const graphics = new Graphics();

        graphics.rect(0, 0, this.chunkSize, this.chunkSize);
        graphics.stroke({
            color: 0xff00ff,
            alpha: 0.5,
            width: 2,
        });

        this.addGraphics(graphics);
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

        if (Math.random() < 0.2) { 
            new Jump(this, this.root, { position });
        } else {
            new Tree(this, this.root, { position });
        }
    }
}