import { TextStyle } from "pixi.js";
import { Vector2D } from "../../../math/Vector2D.ts";
import { GameObject } from "../../GameObject.ts";
import { OffsetContainer } from "../../OffsetContainer.ts";
import { ScoreText } from "./ScoreText.ts";
import { FadingText } from "../FadingText.ts";

export class ScoringDisplay extends GameObject {
    
    private padding: number = 16;

    private score: ScoreText;
    private points: FadingText[] = [];

    constructor(root: OffsetContainer, padding: number = 16) {
        const scrrenSize = new Vector2D(globalThis.innerWidth, globalThis.innerHeight);
        const position = new Vector2D(-scrrenSize.x / 2 + padding, scrrenSize.y / 2 - padding); // Bottom-left corner

        super(root, position);
        this.padding = padding;

        this.score = new ScoreText(this, "0");

        this.test();
    }

    private test() {
        setTimeout(() => this.addScore(100, "100"), 500);
        setTimeout(() => this.addScore(250, "350"), 1000);
        setTimeout(() => this.addScore(500, "850"), 2000);
        setTimeout(() => this.addScore(150, "1000"), 3000);
        setTimeout(() => this.addScore(50, "1050"), 4000);
        setTimeout(() => this.addScore(200, "1250"), 5000);
        setTimeout(() => this.addScore(750, "2000"), 6000);
        setTimeout(() => this.addScore(300, "2300"), 7000);
        setTimeout(() => this.addScore(400, "2700"), 8000);
        setTimeout(() => this.addScore(600, "3300"), 9000);
        setTimeout(() => this.addScore(700, "4000"), 10000);
    }

    public addScore(points: number, score: string) {
        this.score.setText(score);
        this.pushPointText(points);
    }

    private pushPointText(points: number) {
        const size = 24;

        const pointText = new FadingText(this, `+${points}`, new TextStyle({
            fontSize: size,
            fill: "#ffd700",
            fontWeight: "bold",
        }), 2, 2);
        pointText.Position = new Vector2D(0, -this.score.container.height);

        for (const existingText of this.points) {
            existingText.Position = existingText.Position.add(new Vector2D(0,  -size));
        }

        this.points.push(pointText);
    }

    protected override createOwnSprites(): Promise<void> {
        this.container.label = "ScoreDisplay";

        return Promise.resolve();
    }
}