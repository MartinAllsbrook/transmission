import { TextStyle } from "pixi.js";
import { GameObject } from "framework";
import { RichText } from "./RichText.ts";

export class FadingText extends RichText {
    private tillFadeStart: number
    private tillFadeEnd: number
    private fadeOutTime: number

    constructor(parent: GameObject, content: string, style: TextStyle = new TextStyle(), tillFadeStart: number = 1, fadeOutTime: number = 1) {
        super(parent, content, style);
        this.tillFadeStart = tillFadeStart;
        this.tillFadeEnd = fadeOutTime;
        this.fadeOutTime = fadeOutTime;
    }

    public override update(deltaTime: number): void {
        if (this.tillFadeStart > 0) {
            this.tillFadeStart -= deltaTime;
        } else {
            this.tillFadeEnd -= deltaTime;
            this.container.alpha = Math.max(0, this.tillFadeEnd / this.fadeOutTime);
            if (this.tillFadeEnd <= 0) {
                this.destroy();
                return; // Exit early to prevent accessing destroyed properties
            }
        }

        super.update(deltaTime);
    }
}