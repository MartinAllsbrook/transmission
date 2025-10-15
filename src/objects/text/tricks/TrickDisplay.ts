import { Vector2D } from "../../../math/Vector2D.ts";
import { LayerManager } from "../../../rendering/LayerManager.ts";
import { GameObject } from "../../GameObject.ts";
import { TrickExecution, LandTrickPopup } from "./LandTrickPopup.ts";
import { TrickPopup } from "./TrickPopup.ts";



export class TrickDisplay extends GameObject {
    private currentTrickPopups: TrickPopup[] = [];
    
    constructor(root: GameObject, location: Vector2D = new Vector2D(0, -128)) {
        super(root, location);

        this.container.label = "TrickDisplay";

        LayerManager.getLayer("ui")?.attach(this.container);
    }

    // Value Tricks
    // - Spin (Frontside, Backside)
    // - Airtime

    // Tricks
    // - Boardslide
    // - Lipslide
    // - 50-50
    // - Shifty
    // - Grab (Indy, Melon, Tail, Nose)


    public addTrick(trick: string): TrickPopup {
        const trickPopup = new TrickPopup(this, trick);

        trickPopup.Position = new Vector2D(0, -this.currentTrickPopups.length * (24 + 8));
        this.currentTrickPopups.push(trickPopup);

        return trickPopup;
    }

    public landTrick(execution: TrickExecution): LandTrickPopup {
        for (const popup of this.currentTrickPopups) {
            popup.destroyAfter();
        }

        this.currentTrickPopups = [];

        const landPopup = new LandTrickPopup(this, execution);
        landPopup.Position = new Vector2D(0, 36);
        return landPopup;
    } 
}