import { GameObject } from "../../../framework/GameObject.ts";
import { GameRoot } from "../../../framework/GameRoot.ts";
import { Text } from "pixi.js";
import { Vector2D } from "../../../framework/math/Vector2D.ts";

export class TrickPrecisionText extends GameObject {
    public override get Name(): string {
        return "TrickFeedbackText";
    }
    public override get layer(): string {
        return "ui";
    }

    private textElement: Text;

    private timeAlive: number = 0;
    private lifetime: number = 2; // seconds

    constructor(
        parent: GameRoot | GameObject,
        root: GameRoot,
        precision: "Perfect" | "Great" | "Good" | "Okay" | "Poor",
        extraText: string = "",
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

        switch (precision) {
            case "Perfect":
                this.textElement.style.fill = "#FF00FF"; // Magenta
                break;
            case "Great":
                this.textElement.style.fill = "#0000FF"; // Blue
                break;
            case "Good":
                this.textElement.style.fill = "#00FF00"; // Green
                break;
            case "Okay":
                this.textElement.style.fill = "#FFFF00"; // Yellow
                break;
            case "Poor":
                this.textElement.style.fill = "#FF0000"; // Red
                break;
            default:
                this.textElement.style.fill = "#000000"; // White
        }

        this.textElement.text = precision + extraText;

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
