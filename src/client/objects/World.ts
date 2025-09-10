import { Point } from "pixi.js";
import { GameObject, Parent } from "./GameObject.ts";
import { Obstacle } from "./Obstacle.ts";
import { WorldChunk } from "./WorldChunk.ts";
import { Snowboarder } from "./Snowboarder.ts";

export class World extends GameObject {

    private playerVelocity: Point = new Point(0, -1);

    private chunkActiveArea = new Point(3, 2);
    private chunkSize = new Point(256, 256);

    private chunkPosition: Point = new Point(0, 0);

    player: Snowboarder;

    constructor(parent: Parent, player: Snowboarder) {
        super(parent, new Point(0, 0));
    
        this.player = player;
    }

    public override update(deltaTime: number): void {
        // Move world origin
        this.position.x = -this.player.worldPosition.x;
        this.position.y = -this.player.worldPosition.y

        this.chunkPosition = new Point(
            Math.floor((this.position.x / this.chunkSize.x) + 0.5),
            Math.floor((this.position.y / this.chunkSize.y) + 0.5)
        );

        this.updateChunks();

        super.update(deltaTime);
    }

    private updateChunks() {
        for (let x = -this.chunkActiveArea.x; x <= this.chunkActiveArea.x; x++) {
            for (let y = -this.chunkActiveArea.y; y <= this.chunkActiveArea.y; y++) {
                const chunkCoord = new Point(this.chunkPosition.x + x, this.chunkPosition.y + y);

                const existingChunk = this.children.find(child => {
                    if (child instanceof WorldChunk) {
                        return child.chunkPosition.x === chunkCoord.x && child.chunkPosition.y === chunkCoord.y;
                    }
                    return false;
                });

                if (!existingChunk) {
                    console.log("Creating chunk at", chunkCoord);

                    const chunkWorldPosition = new Point(
                        chunkCoord.x * -this.chunkSize.x,
                        chunkCoord.y * -this.chunkSize.y
                    );
                    new WorldChunk(this, chunkWorldPosition, chunkCoord, this.chunkSize);
                }
            }
        }

        for (const chunk of this.children) {
            if (chunk instanceof WorldChunk) {
                const reativePosition = new Point(
                    chunk.chunkPosition.x - this.chunkPosition.x,
                    chunk.chunkPosition.y - this.chunkPosition.y
                );
    
                if (Math.abs(reativePosition.x) > this.chunkActiveArea.x ||
                    Math.abs(reativePosition.y) > this.chunkActiveArea.y) {
                    console.log("Removing chunk at", chunk.chunkPosition);
                    chunk.destroy();
                }
            }
        }
    }
}