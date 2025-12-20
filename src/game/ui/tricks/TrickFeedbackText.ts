import { GameObject } from "../../../framework/GameObject.ts";
import { GameRoot } from "../../../framework/GameRoot.ts";
import { Text } from "pixi.js";
import { Vector2D } from "../../../framework/math/Vector2D.ts";

export class TrickFeedbackText extends GameObject {
    public override get Name(): string { return "TrickFeedbackText"; }
    public override get layer(): string { return "ui"; }

    private textElement: Text;

    private timeAlive: number = 0;
    private lifetime: number = 2; // seconds

    constructor(
        parent: GameRoot | GameObject,
        root: GameRoot,
        text: string,
    ) {
        super(parent, root, {
            position: new Vector2D(0, -50),
        });

        this.textElement = new Text()
        this.textElement.text = text;
        this.textElement.anchor.set(0.5);
        this.textElement.style.fontFamily = "Arial";
        this.textElement.style.fontSize = 48;
        this.textElement.style.fill = "#FFFF00";
        this.textElement.style.fontWeight = "bold";
        this.addGraphics(this.textElement);

        this.textElement.text = text;
    }

    protected override update(deltaTime: number): void {
        this.Transform.Position = new Vector2D(0, -50 - (200 * (this.timeAlive / this.lifetime)));
        this.textElement.alpha = 1 - (this.timeAlive / this.lifetime);

        this.timeAlive += deltaTime;
        if (this.timeAlive >= this.lifetime) {
            this.destroy();
        }
    }
}