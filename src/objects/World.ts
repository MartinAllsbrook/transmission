import { GameObject, Parent } from "./GameObject.ts";
import { WorldChunk } from "./WorldChunk.ts";
import { Snowboarder } from "./Snowboarder.ts";
import { Vector2D } from "src/math/Vector2D.ts";

export class World extends GameObject {
    private playerVelocity: Vector2D = new Vector2D(0, -1);

    private chunkActiveArea = new Vector2D(1, 1);
    private chunkSize = new Vector2D(256, 256);

    private chunkPosition: Vector2D = new Vector2D(0, 0);

    player: Snowboarder;

    constructor(parent: Parent, player: Snowboarder) {
        super(parent, new Vector2D(0, 0), new Vector2D(0, 0));

        this.player = player;
    }

    public override update(deltaTime: number): void {
        // Move world origin
        this.position.x = -(this.player.worldPosition.x + this.chunkSize.x / 2);
        this.position.y = -(this.player.worldPosition.y + this.chunkSize.y / 2);

        this.chunkPosition = new Vector2D(
            Math.floor((this.position.x / this.chunkSize.x) + 1),
            Math.floor((this.position.y / this.chunkSize.y) + 1),
        );

        super.update(deltaTime);
        this.updateChunks();
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
                    new WorldChunk(
                        this,
                        chunkWorldPosition,
                        chunkCoord,
                        this.chunkSize,
                    );
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
}
