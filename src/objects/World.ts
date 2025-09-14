import { GameObject, Parent } from "./GameObject.ts";
import { WorldChunk } from "./WorldChunk.ts";
import { Snowboarder } from "./Snowboarder.ts";
import { Vector2D } from "src/math/Vector2D.ts";
import { SnowboarderTrail } from "./SnowbarderTrail.ts";
import { BezierSpline } from "../math/BezierSpline.ts";
import { Container, Graphics } from "pixi.js";

interface SkiRunSpline {
    spline: BezierSpline;
    nextRun?: SkiRunSpline;
}

export class World extends GameObject {
    private playerVelocity: Vector2D = new Vector2D(0, -1);

    private chunkActiveArea = new Vector2D(5, 3);
    private runsActiveArea = new Vector2D(10, 6);
    private chunkSize = new Vector2D(256, 256);

    private chunkPosition: Vector2D = new Vector2D(0, 0);

    player: Snowboarder;

    private runSplines: SkiRunSpline[] = [];

    constructor(parent: Parent, player: Snowboarder) {
        super(parent, new Vector2D(0, 0), new Vector2D(0, 0));

        this.AutoCenter = false;

        this.player = player;
        new SnowboarderTrail(this);
        this.container.label = "World";

        // TODO: Idk if this is needed
        // Move world origin
        this.position.x = -(this.player.worldPosition.x);
        this.position.y = -(this.player.worldPosition.y);

        // Create initial ski run
        const initialRun2 = {
            spline: new BezierSpline([
                new Vector2D(128, 128),
                new Vector2D(512, 512),
                new Vector2D(-512, 1024),
                new Vector2D(0, 1536),
            ]),
        };

        const initialRun1 = {
            spline: new BezierSpline([
                new Vector2D(-512, -1536),
                new Vector2D(512, -1024),
                new Vector2D(-512, -512),
                new Vector2D(128, 128),
            ]),
            nextRun: initialRun2
        };
        
        this.runSplines.push(initialRun1);
        this.runSplines.push(initialRun2);
        // initialRun1.spline.drawDebug(this);
        // initialRun2.spline.drawDebug(this);
        
    }

    public getDistanceToNearestRun(position: Vector2D): number {
        let nearestDistance = Infinity;
        
        for (const run of this.runSplines) {
            const distance = run.spline.getDistanceToPoint(position);
            if (distance < nearestDistance) {
                nearestDistance = distance;
            }
        }

        return nearestDistance;
    }

    /**
     * ### Debugging use only
     * Adds a visual element directly to the world container
     * @param visual - The visual element to add
     */
    public addVisual(visual: Container) {
        this.container.addChild(visual);
    }

    public override update(deltaTime: number): void {
        // Move world origin
        this.position.x = -(this.player.worldPosition.x);
        this.position.y = -(this.player.worldPosition.y);

        this.chunkPosition = new Vector2D(
            Math.floor((this.position.x / this.chunkSize.x) + 1),
            Math.floor((this.position.y / this.chunkSize.y) + 1),
        );

        super.update(deltaTime);
        this.updateChunks();
    }

    private updateRuns() {
        for (const run of this.runSplines) {
            
        }
    }

    private updateChunks() {
        for (
            let x = -this.chunkActiveArea.x;
            x <= this.chunkActiveArea.x;
            x++
        ) {
            for (
                let y = -this.chunkActiveArea.y;
                y <= this.chunkActiveArea.y;
                y++
            ) {
                const chunkCoord = new Vector2D(
                    this.chunkPosition.x + x,
                    this.chunkPosition.y + y,
                );

                const existingChunk = this.children.find((child) => {
                    if (child instanceof WorldChunk) {
                        return child.chunkPosition.x === chunkCoord.x &&
                            child.chunkPosition.y === chunkCoord.y;
                    }
                    return false;
                });

                if (!existingChunk) {
                    const chunkWorldPosition = new Vector2D(
                        chunkCoord.x * -this.chunkSize.x,
                        chunkCoord.y * -this.chunkSize.y,
                    );
                    const chunk = new WorldChunk(
                        this,
                        chunkWorldPosition,
                        chunkCoord,
                        this.chunkSize,
                    );
                    chunk.createSprite();
                }
            }
        }

        for (const chunk of this.children) {
            if (chunk instanceof WorldChunk) {
                const reativePosition = new Vector2D(
                    chunk.chunkPosition.x - this.chunkPosition.x,
                    chunk.chunkPosition.y - this.chunkPosition.y,
                );

                if (
                    Math.abs(reativePosition.x) > this.chunkActiveArea.x ||
                    Math.abs(reativePosition.y) > this.chunkActiveArea.y
                ) {
                    console.log("Removing chunk at", chunk.chunkPosition);
                    chunk.destroy();
                }
            }
        }
    }

    public override get WorldPosition(): Vector2D {
        return new Vector2D(0, 0);
    }
}
