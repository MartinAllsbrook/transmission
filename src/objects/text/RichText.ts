import { Text, TextStyle } from "pixi.js";
import { GameObject } from "framework";

export class RichText extends GameObject {
    private style: TextStyle;
    private content: string;
    private textSprite?: Text;
    private anchor: { x: number; y: number };

    constructor(
        parent: GameObject,
        content: string,
        style: TextStyle = new TextStyle(),
        anchor: { x: number; y: number } = { x: 0, y: 1 },
    ) {
        super(parent);

        const defaultStyleOptions = {
            fontFamily: "Arial",
            fontSize: 16,
            fill: "#000000",
        };

        this.content = content;
        this.style = new TextStyle({
            ...style,
            ...defaultStyleOptions,
        });
        this.anchor = anchor;
    }

    protected override async createOwnSprites(): Promise<void> {
        this.textSprite = new Text({
            style: this.style,
            text: this.content,
            anchor: this.anchor,
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

    public getText(): string {
        return this.content;
    }
}
