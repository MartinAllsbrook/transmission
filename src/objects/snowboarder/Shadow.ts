import { Graphics } from "pixi.js";
import { GameObject, Parent } from "../GameObject.ts";
import { LayerManager } from "../../rendering/LayerManager.ts";

export class Shadow extends GameObject {
    constructor(parent: Parent) {
        super(parent);
        this.container.label = "Shadow";

        LayerManager.getLayer("shadows")?.attach(this.container);
    }

    protected override createOwnSprites(): Promise<void> {
        let radius = 20;
        for (let i = 0; i < 3; i++) {
            const ellipse = new Graphics()
            .ellipse(0, 0, radius, radius / 2)
            .fill({
                color: "#000000", 
                alpha: 0.15
            })
            this.container.addChild(ellipse);
            radius *= 0.7;
        }

        

    
        return super.createOwnSprites(); // Ensure async context
    }
}