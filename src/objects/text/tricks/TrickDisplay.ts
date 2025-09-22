import { Vector2D } from "../../../math/Vector2D.ts";
import { GameObject } from "../../GameObject.ts";
import { TrickExecution, LandTrickPopup } from "./LandTrickPopup.ts";
import { TrickPopup } from "./TrickPopup.ts";



export class TrickDisplay extends GameObject {
    private currentTrickPopups: TrickPopup[] = [];
    
    constructor(root: GameObject, location: Vector2D = new Vector2D(0, -128)) {
        super(root, location);

        this.container.label = "TrickDisplay";
    }

    public addTrick(trickName: string): TrickPopup {
        const trickPopup = new TrickPopup(this, trickName);

        this.currentTrickPopups.push(trickPopup);

        return trickPopup;
    }

    public landTrick(execution: TrickExecution): LandTrickPopup {
        for (const popup of this.currentTrickPopups) {
            popup.destroyAfter();
        }

        return new LandTrickPopup(this, execution);
    } 
}