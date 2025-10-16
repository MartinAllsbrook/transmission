import { Vector2D } from "../../../math/Vector2D.ts";
import { LayerManager } from "../../../rendering/LayerManager.ts";
import { GameObject } from "../../../framework/GameObject.ts";
import { SnowParticles } from "./SnowParticles.ts";

export class SnowLayer extends GameObject {
    private index: number;
    private chunkSize: number;

    // private chunks: SnowParticles[][] = [];

    private radii = new Vector2D(1, 1);

    private chunks: Map<Vector2D, SnowParticles> = new Map();

    constructor(parent: GameObject, index: number, chunkSize: number){
        super(parent);

        this.index = index;
        this.chunkSize = chunkSize;

        const renderLayer = LayerManager.getLayer(`snowLayer${this.index}`);

        for (let x = -this.radii.x; x <= this.radii.x; x++) {           
            for (let y = -this.radii.y; y <= this.radii.y; y++) {
                const position = new Vector2D(x * this.chunkSize, y * this.chunkSize);

                this.chunks.set(
                    new Vector2D(x, y), 
                    new SnowParticles(this, this.chunkSize, position, renderLayer)
                );
            }
        }
    }

    public override update(deltaTime: number): void {
        const chunkPosition = new Vector2D(
            Math.floor((this.position.x / this.chunkSize) + 1),
            Math.floor((this.position.y / this.chunkSize) + 1),
        );

        // console.log(`Chunk Position: (${chunkPosition.x}, ${chunkPosition.y})`);


        const activeCoords: Vector2D[] = [];
        for (let x = -this.radii.x; x <= this.radii.x; x++) {
            for (let y = -this.radii.y; y <= this.radii.y; y++) {
                const baseCoord = new Vector2D(x, y)
                activeCoords.push(chunkPosition.negate().add(baseCoord));
            }
        }
        
        const toRemove = Array.from(this.chunks.keys()).filter((key) => {
            return !activeCoords.some((coord) => {
                return coord.equals(key)
            })
        });
        

        const toAdd = activeCoords.filter((coord) => {
            return !Array.from(this.chunks.keys()).some((key) => {
                return coord.equals(key)
            })
        });


        // console.log(`
        //     Chunk position: (${chunkPosition.x}, ${chunkPosition.y}), \n
        //     Removing ${toRemove.length}, \n
        //     Adding ${toAdd.length} \n
        // `); 


        for (const removeCoord of toRemove) {
            console.log(`Removing chunk at (${removeCoord.x}, ${removeCoord.y})`);
            const chunk = this.chunks.get(removeCoord);
            chunk?.destroy();
            this.chunks.delete(removeCoord);
        }

        for (const addCoord of toAdd) {
            console.log(`Adding chunk at (${addCoord.x}, ${addCoord.y})`);
            const position = addCoord.multiply(this.chunkSize);

            this.chunks.set(
                addCoord, 
                new SnowParticles(this, this.chunkSize, position, LayerManager.getLayer(`snowLayer${this.index}`))
            );
        }

        super.update(deltaTime);
    }
}