import { GameObject } from "framework";
import { RootObject } from "../../RootObject.ts";
import { World } from "../World.ts";
import { SnowLayer } from "./SnowLayer.ts";

export class Snow extends GameObject {
    private chunkSize: number = 800;
    private layers: SnowLayer[] = [];
    private world: World;

    constructor(parent: RootObject, world: World) {
        super(parent);

        this.world = world;

        for (let layer = 0; layer < 3; layer++) {
            this.layers.push(new SnowLayer(this, layer, this.chunkSize));
        }
    }

    public override update(_deltaTime: number): void {
        super.update(_deltaTime);

        for (let layer = 0; layer < this.layers.length; layer++) {
            this.layers[layer].Position = this.world.Position.multiply(
                1 + (layer + 1) * 0.12,
            );
        }
    }
}
