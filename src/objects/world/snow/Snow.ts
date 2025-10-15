import { GameObject } from "../../GameObject.ts";
import { SnowLayer } from "./SnowLayer.ts";

export class Snow extends GameObject {
    private chunkSize: number = 800;
    private layers: SnowLayer[] = []; 

    constructor(parent: GameObject){
        super(parent);
    
        for (let layer = 0; layer < 3; layer++) {
            this.layers.push(new SnowLayer(this, layer, this.chunkSize));
        }
    }

    public override update(_deltaTime: number): void {
        // this.position = 
        super.update(_deltaTime);
    }
}