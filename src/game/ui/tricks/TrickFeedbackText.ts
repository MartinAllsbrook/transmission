import { GameObject } from "../../../framework/GameObject.ts";
import { GameRoot } from "../../../framework/GameRoot.ts";
import { Graphics, Text } from "pixi.js";
import { Vector2D } from "../../../framework/math/Vector2D.ts";
import { TrickManager } from "../../player/TrickManager.ts";

export class TrickFeedbackText extends GameObject {
    public override get Name(): string {
        return "TrickFeedbackText";
    }
    public override get layer(): string {
        return "ui";
    }

    private trickManager: TrickManager;

    private textElement: Text;

    private timeAlive: number = 0;
    private lifetime: number = 3; // seconds

    private boxSize: Vector2D = new Vector2D(256, 24);

    constructor(
        parent: TrickManager,
        root: GameRoot,
        text: string,
        position: Vector2D,
    ) {
        super(parent, root, { position });

        this.trickManager = parent;
        this.trickManager.addDisplay(this);

        this.textElement = new Text();
        this.textElement.text = text;
        this.textElement.anchor.set(0.5);
        this.textElement.style.fontFamily = "Arial";
        this.textElement.style.fontSize = 18;
        this.textElement.style.fill = "#000000";
        this.textElement.style.fontWeight = "bold";

        const background = new Graphics();
        background.rect(0, 0, this.boxSize.X, this.boxSize.Y);
        background.fill({ color: 0xFFF000 });

        this.addGraphics(background, { pivot: new Vector2D(0, 0) });
        this.addGraphics(this.textElement, { pivot: new Vector2D(0, 0), position: new Vector2D(this.boxSize.X / 2, this.boxSize.Y / 2) });
    }

    protected override update(deltaTime: number): void {
        this.Container.alpha = Math.min(1, (1 - (this.timeAlive / this.lifetime)) * 3);
        

        this.timeAlive += deltaTime;
        if (this.timeAlive >= this.lifetime) {
            this.destroy();
        }
    }

    public override destroy(): void {
        this.trickManager.removeDisplay(this);
        super.destroy();
    }

    public updateText(newText: string): void {
        this.timeAlive = 0; // Reset time alive to keep it visible longer
        this.textElement.text = newText;
    }
}
