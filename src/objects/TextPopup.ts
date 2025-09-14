import { Text, TextStyle } from "pixi.js";
import { GameObject, Parent } from "./GameObject.ts";

export class TextPopup extends GameObject {
    private text: string;
    private color: string;
    private lifetime: number;

    constructor(parent: Parent, text: string, color: string = "#000000", lifetime: number = 5) {
        super(parent);

        console.log("TextPopup Container:", );

        this.container.position.set(0, 0)

        this.text = text;
        this.color = color;
        this.lifetime = lifetime;
    }

    public override async createSprite() {
        await Promise.resolve(); // Ensure async context

        const style = new TextStyle({
            fontFamily: "Arial",
            fontSize: 24,
            fill: this.color,
            stroke: this.color,
            fontWeight: "bold",
        });

        const textSprite = new Text();
        textSprite.style = style;
        textSprite.text = this.text;
        textSprite.anchor.set(0.5);
        this.container.addChild(textSprite);
        this.container.label = "TextPopup";
    }


    public override update(deltaTime: number): void {
        this.position.y -= 15 * deltaTime;
        this.container.alpha -= 0.25 * deltaTime;
        this.lifetime -= deltaTime;
        console.log("Lifetime:", this.lifetime);
        if (this.lifetime <= 0) {
            this.destroy();
        }

        super.update(deltaTime);
    }
}