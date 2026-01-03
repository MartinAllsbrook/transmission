import { GameObject, GameRoot, Transform, TransformOptions } from "framework";
import { SnowLayer } from "./SnowLayer.ts";

export class Snow extends GameObject {
    public override get Name(): string {
        return "Snow";
    }
    public override get layer(): string {
        return "snow";
    }

    private chunkSize: number = 800;
    private layers: SnowLayer[] = [];

    private playerTransform: Transform;

    constructor(
        parent: GameObject | GameRoot,
        root: GameRoot,
        playerTransform: Transform,
        transformOptions?: TransformOptions,
    ) {
        super(parent, root, transformOptions);

        this.playerTransform = playerTransform;

        for (let layer = 0; layer < 3; layer++) {
            this.layers.push(new SnowLayer(
                this, 
                this.root, 
                layer, 
                this.chunkSize, 
                playerTransform
            ));
        }
    }

    public override update(_deltaTime: number): void {
        super.update(_deltaTime);

        for (let layer = 0; layer < this.layers.length; layer++) {
            this.layers[layer].Transform.Position = this.playerTransform.Position.multiply(
                (layer + 1) * (-0.1),
            );
        }
    }
}
