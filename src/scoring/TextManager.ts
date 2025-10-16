import { GameObject } from "framework";
import { OverheadText } from "../objects/text/OverheadText.ts";
import { ScoringDisplay } from "../objects/text/score/ScoringDisplay.ts";
import { TrickDisplay } from "../objects/text/tricks/TrickDisplay.ts";
import { UpdatingText } from "../objects/text/UpdatingText.ts";

export class TextManager{
    private static root: GameObject;
    
    public static initialize(root: GameObject) {
        this.root = root;

    }

    public static createScoreFadeoutText(points: number) {
        TextManager.createFadeoutText(`+${points}`, "#CCAC00", 4, 3);
    }

    public static createFadeoutText(text: string, color: string, size: number, lifetime: number) {
        const _object = new OverheadText(this.root, text, color, size, lifetime);
        // Object will automatically call createSprite() via queueMicrotask
    }

    public static createUpdatingText(title: string, text: string, color: string, size: number): UpdatingText {
        const object = new UpdatingText(this.root, title, text, color, size);
        return object;
        // Object will automatically call createSprite() via queueMicrotask
    }

    public static createScoringDisplay() {
        return new ScoringDisplay(this.root);
    }

    public static createTrickDisplay() {
        const trickDisplay = new TrickDisplay(this.root);
        return trickDisplay;
    }
}