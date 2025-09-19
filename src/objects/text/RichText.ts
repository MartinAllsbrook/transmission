import { Text, TextStyle } from "pixi.js";
import { GameObject } from "../GameObject.ts";
import { Vector2D } from "../../math/Vector2D.ts";

export class RichText extends GameObject {
    private style: TextStyle;
    private content: string;
    private textSprite?: Text;

    constructor(parent: GameObject, content: string, style: TextStyle = new TextStyle()) {
        super(parent);

        const defaultStyleOptions = {
            fontFamily: "Arial",
            fontSize: 16,
            fill: "#000000",
        };

        this.content = content;
        this.style = new TextStyle({
            ...style,
            ...defaultStyleOptions
        });

    }

    protected override async createOwnSprites(): Promise<void> {
        this.textSprite = new Text({
            style: this.style,
            text: this.content,
            anchor: { x: 0, y: 1 },
        });
    
        this.container.addChild(this.textSprite);

        return await Promise.resolve(); // Ensure async context
    }

    public setText(newText: string): void {
        this.content = newText;
        if (this.textSprite) {
            this.textSprite.text = newText;
        }
    }
}