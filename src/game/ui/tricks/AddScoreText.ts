import { GameObject, GameRoot, Vector2D } from "framework";
import { ScoreDisplay } from "./ScoreDisplay.ts";
import { Text } from "pixi.js";

export class AddScoreText extends GameObject {
    public override get Name(): string {
        return "AddScoreText";
    }

    public override get layer(): string {
        return "ui";
    }

    private textElement: Text;

    private timeAlive: number = 0;
    private lifetime: number = 2; // seconds

    constructor(
        parent: ScoreDisplay,
        root: GameRoot,
        score: number,
    ) {
        super(parent, root, {
            position: new Vector2D(0, -100),
        });

        this.textElement = new Text();
        this.textElement.anchor.set(0.5);
        this.textElement.style.fontFamily = "Arial";
        this.textElement.style.fontSize = 32;
        this.textElement.style.fontWeight = "bold";
        this.textElement.style.fontStyle = "italic";
        this.textElement.style.fill = 0xFFF000;

        this.textElement.text = "+" + score.toFixed(0)

        this.addGraphics(this.textElement);
    }

    protected override update(deltaTime: number): void {
        this.Transform.Position = new Vector2D(
            0,
            -100 - (200 * (this.timeAlive / this.lifetime)),
        );
        this.textElement.alpha = 1 - (this.timeAlive / this.lifetime);

        this.timeAlive += deltaTime;
        if (this.timeAlive >= this.lifetime) {
            this.destroy();
        }
    }
}