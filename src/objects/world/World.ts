import { GameObject, Parent } from "../GameObject.ts";
import { WorldChunk } from "./WorldChunk.ts";
import { Snowboarder } from "../snowboarder/Snowboarder.ts";
import { Vector2D } from "src/math/Vector2D.ts";
import { SnowboarderTrail } from "../snowboarder/SnowbarderTrail.ts";
import { BezierSpline } from "../../math/splines/BezierSpline.ts";
import { Container } from "pixi.js";
import { SplinePoint } from "../../math/splines/SplinePoint.ts";
import { SkiRun } from "./SkiRun.ts";
import { Trails } from "./trails/Trails.ts";

interface SkiRunSpline {
    spline: BezierSpline;
    object: SkiRun;
    nextRun?: SkiRunSpline;
}

interface SkiRunNode {
    point: SplinePoint;
    next?: SkiRunNode;
}

export class World extends GameObject {
    player: Snowboarder;

    private trails: Trails;

    private chunkActiveArea = new Vector2D(5, 3);
    private runsActiveArea = new Vector2D(10, 6);
    private chunkSize = new Vector2D(256, 256);

    private chunkPosition: Vector2D = new Vector2D(0, 0);

    private runNodes: SkiRunNode[] = [];
    private runSplines: SkiRunSpline[] = [];

    constructor(parent: Parent, player: Snowboarder) {
        super(parent, new Vector2D(0, 0));

        this.AutoCenter = false;

        this.player = player;
        new SnowboarderTrail(this);
        this.container.label = "World";

        this.trails = new Trails(this);

        // TODO: Idk if this is needed
        // Move world origin
        this.position.x = -(this.player.worldPosition.x);
        this.position.y = -(this.player.worldPosition.y);

        // Initial run point
        const startPoint = new SplinePoint(new Vector2D(0, 0), new Vector2D(0, 128));
        this.runNodes.push({ point: startPoint });

        this.updateRuns();
    }

    public getDistanceToNearestRun(position: Vector2D): number {
        let nearestDistance = Infinity;
        
        for (const run of this.runSplines) {
            const distance = run.spline.getDistanceToPoint(position, 10);
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
        this.updateRuns();
        this.updateChunks();
        this.updateTrails();
    }

    private updateTrails() {
        const upperBound = (this.runsActiveArea.y * this.chunkSize.y) - this.position.y;
        const lowerBound = (this.runsActiveArea.y * this.chunkSize.y * -1) - this.position.y;

        console.log(`Trail bounds: ${lowerBound.toFixed(0)} to ${upperBound.toFixed(0)}`);

        if (this.trails.getLastPoint().y < lowerBound) {
            this.trails.shortenTrail();
        }

        if (this.trails.getFirstPoint().y < upperBound) {
            this.trails.extendTrail();
        }
    }

    private updateRuns() {
        for (const node of this.runNodes) {
            const lowerBound = new Vector2D(
                this.runsActiveArea.x * -1 * (this.chunkSize.x + 128),
                this.runsActiveArea.y * -1 * (this.chunkSize.y + 128),
            ).subtract(this.position);
            const upperBound = new Vector2D(
                this.runsActiveArea.x * (this.chunkSize.x + 128),
                this.runsActiveArea.y * (this.chunkSize.y + 128)
            ).subtract(this.position);

            if (
                node.point.Position.x > lowerBound.x &&
                node.point.Position.x < upperBound.x &&
                node.point.Position.y > lowerBound.y &&
                node.point.Position.y < upperBound.y
            ) {
                if (!node.next) {
                    // Create a new run segment
                    const newPoint = new SplinePoint(
                        node.point.Position.add(new Vector2D(
                            (Math.random() - 0.5) * 512,
                            -256 + (Math.random() * 512 + 512),
                        )),
                        new Vector2D((Math.random() - 0.5) * 256, 128),
                    );

                    node.next = { point: newPoint };
                    this.runNodes.push(node.next);

                    const newSpline = BezierSpline.createCubicFromPoints(node.point, newPoint);
                    this.runSplines.push({ spline: newSpline, object: new SkiRun(this, newSpline) }); 
                }
            }
        }
    }

    private updateChunks() {
        for (let x = -this.chunkActiveArea.x; x <= this.chunkActiveArea.x; x++) {
            for (let y = -this.chunkActiveArea.y; y <= this.chunkActiveArea.y; y++) {
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
                    const _chunk = new WorldChunk(
                        this,
                        chunkWorldPosition,
                        chunkCoord,
                        this.chunkSize,
                    );
                    // Chunk will automatically call createSprite() via queueMicrotask
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
                    chunk.destroy();
                }
            }
        }
    }

    public override get WorldPosition(): Vector2D {
        return new Vector2D(0, 0);
    }
}
