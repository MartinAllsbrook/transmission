import { BitmapFont, BitmapText, Text } from "pixi.js";
import { GameObject, Vector2D } from "framework";

export class UpdatingText extends GameObject {
    private title: string;
    private text: string;
    private color: string;
    private textSize: number;

    private textSprite?: BitmapText;

    constructor(
        parent: GameObject,
        title: string,
        text: string,
        color: string = "#000000",
        size: number = 4,
        position: Vector2D = new Vector2D(32, 0),
    ) {
        super(parent);
        this.title = title;
        this.text = text;
        this.color = color;
        this.textSize = size;
        this.position = position;

        BitmapFont.install({
            name: "Arial",
            style: {
                fontFamily: "Arial",
                fontSize: 8 * this.textSize,
                fill: this.color,
            },
        });
    }

    protected override async createOwnSprites(): Promise<void> {
        await Promise.resolve(); // Ensure async context

        const header = new Text();
        header.text = this.title;
        header.style.fontFamily = "Arial";
        header.style.fontSize = 8 * this.textSize / 1.618;
        header.style.fill = this.color;

        const textSprite = new BitmapText({
            style: {
                fontFamily: "Arial",
                fontSize: 8 * this.textSize,
                fill: this.color,
            },
        });

        this.container.addChild(header);

        this.textSprite = textSprite;
        textSprite.y = header.height;
        textSprite.text = this.text;
        this.container.addChild(textSprite);
        this.container.label = "IncreasingText";
    }

    public updateText(newText: string): void {
        this.text = newText;

        if (this.textSprite) {
            this.textSprite.text = this.text;
        }
    }
}
