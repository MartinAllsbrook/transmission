import { Vector2D } from "../../../math/Vector2D.ts";
import { GameObject } from "../../GameObject.ts";
import { TrickExecution, LandTrickPopup } from "./LandTrickPopup.ts";
import { TrickPopup } from "./TrickPopup.ts";



export class TrickDisplay extends GameObject {
    constructor(root: GameObject, location: Vector2D = new Vector2D(0, -128)) {
        super(root, location);

        this.container.label = "TrickDisplay";
    }

    public addTrick(trickName: string): TrickPopup {
        return new TrickPopup(this, trickName);
    }

    public landTrick(execution: TrickExecution): LandTrickPopup {
        return new LandTrickPopup(this, execution);
    } 
}