import { GameObject, Parent } from "../GameObject.ts";
import { WorldChunk } from "./WorldChunk.ts";
import { Snowboarder } from "../snowboarder/Snowboarder.ts";
import { Vector2D } from "src/math/Vector2D.ts";
import { SnowboarderTrail } from "../snowboarder/SnowbarderTrail.ts";
import { Container } from "pixi.js";
import { Trails } from "./trails/Trails.ts";
import { TreesContainer } from "./TreesContainer.ts";
import { LayerManager } from "../../rendering/LayerManager.ts";

export class World extends GameObject {
    player: Snowboarder;

    private trails: Trails;

    private chunkActiveArea = new Vector2D(5, 3);
    private runsActiveArea = new Vector2D(10, 6);
    private chunkSize = new Vector2D(256, 256);

    private chunkPosition: Vector2D = new Vector2D(0, 0);

    private treesContainer: TreesContainer;

    constructor(parent: Parent, player: Snowboarder) {
        super(parent, new Vector2D(0, 0));

        this.AutoCenter = false;

        this.treesContainer = new TreesContainer(this);

        this.player = player;
        new SnowboarderTrail(this);
        this.container.label = "World";

        this.trails = new Trails(this);

        LayerManager.getLayer("foreground")?.attach(this.treesContainer.container);

        // TODO: Idk if this is needed
        // Move world origin
        this.position.x = -(this.player.worldPosition.x);
        this.position.y = -(this.player.worldPosition.y);
    }

    public distanceToTrail(position: Vector2D): number {
        return this.trails.getDistanceToTrail(position);
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
        this.updateTrails();
        this.treesContainer.updateMaskPosition(
            this.player.worldPosition.x,
            this.player.worldPosition.y,
        );
    }

    private updateTrails() {
        const upperBound = (this.runsActiveArea.y * this.chunkSize.y) - this.position.y;
        const lowerBound = (this.runsActiveArea.y * this.chunkSize.y * -1) - this.position.y;

        if (this.trails.getLastPoint().y < lowerBound) {
            this.trails.shortenTrail();
        }

        if (this.trails.getFirstPoint().y < upperBound) {
            this.trails.extendTrail();
        }
    }

    private updateChunks() {
        for (let x = -this.chunkActiveArea.x; x <= this.chunkActiveArea.x; x++) {
            for (let y = -this.chunkActiveArea.y; y <= this.chunkActiveArea.y; y++) {
                const chunkCoord = new Vector2D(
                    this.chunkPosition.x + x,
                    this.chunkPosition.y + y,
                );

                const existingChunk = this.treesContainer.children.find((child) => {
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
                        this.treesContainer,
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

    public reset() {
        console.log("Resetting world");
        this.trails.destroy();
        this.trails = new Trails(this);

    }
}
