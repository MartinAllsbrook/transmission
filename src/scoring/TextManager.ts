import { GameObject } from "../objects/GameObject.ts";
import { OverheadText } from "../objects/OverheadText.ts";
import { UpdatingText } from "../objects/text/UpdatingText.ts";

export class TextManager{
    private static root: GameObject;
    
    public static initialize(root: GameObject) {
        this.root = root;
    }

    public static createScoreFadeoutText(points: number) {
        console.log("Creating score text:", points);
        TextManager.createFadeoutText(`+${points}`, "#CCAC00", 4, 3);
    }

    public static createFadeoutText(text: string, color: string, size: number, lifetime: number) {
        const _object = new OverheadText(this.root, text, color, size, lifetime);
        // Object will automatically call createSprite() via queueMicrotask
    }

    public static createUpdatingText(title: string, text: string, color: string, size: number): UpdatingText {
        console.log("Creating updating text:", title, text);
        const object = new UpdatingText(this.root, title, text, color, size);
        return object;
        // Object will automatically call createSprite() via queueMicrotask
    }
}