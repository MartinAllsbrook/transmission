import { GameObject } from "../objects/GameObject.ts";
import { OverheadText } from "../objects/OverheadText.ts";

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
        const object = new OverheadText(this.root, text, color, size, lifetime);
        object.createSprite();
    }
}