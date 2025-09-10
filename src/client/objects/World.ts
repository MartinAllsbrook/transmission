import { Point } from "pixi.js";
import { GameObject, Parent } from "./GameObject.ts";
import { Obstacle } from "./Obstacle.ts";
import { WorldChunk } from "./WorldChunk.ts";

export class World extends GameObject {

    private playerVelocity: Point = new Point(0, -1);
    private originOffset: Point = new Point(0, 0);

    private chunkActiveArea = new Point(256, 256);

    constructor(parent: Parent) {
        super(parent, new Point(0, 0));

        const chunk = new WorldChunk(this, new Point(globalThis.innerWidth/2, globalThis.innerHeight/2));
    }

    public override update(deltaTime: number): void {
        // Move world origin
        this.originOffset.x += this.playerVelocity.x * deltaTime;
        this.originOffset.y += this.playerVelocity.y * deltaTime;

        this.position.set(this.originOffset.x, this.originOffset.y);

        this.checkIfChunksOutOfRange();

        super.update(deltaTime);
    }

    private checkIfChunksOutOfRange() {
        for (const chunk of this.children) {
            const x = Math.abs(chunk.position.x + this.position.x);
            const y = Math.abs(chunk.position.x + this.position.y);

            console.log(x, y)

            if (x > this.chunkActiveArea.x || y > this.chunkActiveArea.y) {
                chunk.destroy();                
            }
        }
    }
}