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

    private trickNameText: Text;
    private scoreText: Text;

    private score: number = 0;

    private timeAlive: number = 0;
    private lifetime: number = 3; // seconds

    private boxSize: Vector2D = new Vector2D(256, 24);

    constructor(
        parent: TrickManager,
        root: GameRoot,
        trick: string, 
        score: number,
        position: Vector2D,
    ) {
        super(parent, root, { position });

        this.trickManager = parent;
        this.trickManager.addDisplay(this);

        this.trickNameText = this.createText();
        this.trickNameText.text = trick;
        this.trickNameText.anchor.set(0, 0.5);

        this.scoreText = this.createText();
        this.scoreText.text = `+${score.toFixed(0)}`;
        this.scoreText.anchor.set(1, 0.5);
        this.scoreText.style.fontStyle = "italic";
        this.scoreText.position = new Vector2D(this.boxSize.X - 8, this.boxSize.Y / 2);



        const background = new Graphics();
        background.rect(0, 0, this.boxSize.X, this.boxSize.Y);
        background.fill({ color: 0xFFF000 });

        this.addGraphics(background, { pivot: new Vector2D(0, 0) });
        this.addGraphics(this.trickNameText, { pivot: new Vector2D(0, 0), position: new Vector2D(8, this.boxSize.Y / 2) });
        this.addGraphics(this.scoreText, { pivot: new Vector2D(1, 0), position: new Vector2D(this.boxSize.X - 8, this.boxSize.Y / 2) });
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

    public updateText(trick: string, additionalScore: number): void {
        this.timeAlive = 0; // Reset time alive to keep it visible longer
        this.trickNameText.text = trick;

        this.score += additionalScore;
        this.scoreText.text = `+${this.score.toFixed(0)}`;
    }

    private createText(): Text {
        const text = new Text();
        text.style.fontFamily = "Arial";
        text.style.fontSize = 18;
        text.style.fill = "#000000";
        text.style.fontWeight = "bold";

        return text;
    }

    public get Score(): number {
        return this.score;
    }
}
