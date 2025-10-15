import { Vector2D } from "../../../math/Vector2D.ts";
import { LayerManager } from "../../../rendering/LayerManager.ts";
import { GameObject } from "../../GameObject.ts";
import { SnowParticles } from "./SnowParticles.ts";

export class SnowLayer extends GameObject {
    private index: number;
    private chunkSize: number;

    private chunks: SnowParticles[][] = [];

    constructor(parent: GameObject, index: number, chunkSize: number){
        super(parent);

        this.index = index;
        this.chunkSize = chunkSize;

        const renderLayer = LayerManager.getLayer(`snowLayer${this.index}`);

        for (let x = 0; x < 3; x++) {
            this.chunks[x] = [];
            
            for (let y = 0; y < 3; y++) {
                const position = new Vector2D((x - 1) * this.chunkSize, (y - 1) * this.chunkSize);

                this.chunks[x][y] = new SnowParticles(this, this.chunkSize, position, renderLayer);
            }
        }
    }
}