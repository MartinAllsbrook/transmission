import { GameObject, GameRoot, Vector2D } from "framework";
import { TrickManager } from "../../player/TrickManager.ts";
import { Text } from "pixi.js";

export class ScoreDisplay extends GameObject {
    public override get Name() {
        return "ScoreDisplay";
    }
    public override get layer(): string {
        return "ui";
    }

    private score: number = 0;

    private scoreText: Text;

    constructor(
        parent: TrickManager,
        root: GameRoot,
    ) {
        super(parent, root);

        this.scoreText = new Text();
        this.scoreText.text = `Score: ${this.score.toFixed(0)}`;
        this.scoreText.style.fontSize = 48;
        this.scoreText.style.fill = 0xFFF000;
        this.scoreText.style.fontWeight = "bold";
        this.scoreText.style.fontStyle = "italic";
        this.scoreText.anchor.set(0, 1);       

        this.addGraphics(this.scoreText, { position: new Vector2D(0, 0) });
    }

    public override update(_deltaTime: number): void {
        this.Transform.Position = new Vector2D(-(globalThis.innerWidth / 2) + 32, (globalThis.innerHeight / 2) - 32);
    }

    public addScore(amount: number): void {
        this.score += amount;
        this.scoreText.text = `Score: ${this.score.toFixed(0)}`;
    }

    protected override reset(): void {
        this.score = 0;
        this.scoreText.text = `Score: ${this.score.toFixed(0)}`;

        super.reset();
    }
}