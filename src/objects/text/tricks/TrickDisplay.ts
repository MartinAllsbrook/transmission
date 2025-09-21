import { Vector2D } from "../../../math/Vector2D.ts";
import { GameObject } from "../../GameObject.ts";

export class TrickDisplay extends GameObject {
    constructor(root: GameObject, location: Vector2D = new Vector2D(128, 256)) {
        super(root, location);

        this.container.label = "TrickDisplay";
    }

    addTrick(trickName: string) {

    }

    landTrick(landing: "Poor" | "Okay" | "Good" | "Perfect") {
        
    }
}