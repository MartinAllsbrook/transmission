import { TextStyle } from "pixi.js";
import { Vector2D } from "../../../math/Vector2D.ts";
import { GameObject } from "../../GameObject.ts";
import { OffsetContainer } from "../../OffsetContainer.ts";
import { ScoreText } from "./ScoreText.ts";
import { FadingText } from "../FadingText.ts";
import { LayerManager } from "../../../rendering/LayerManager.ts";

export class ScoringDisplay extends GameObject {
    
    private padding: Vector2D;

    private score: ScoreText;
    private points: FadingText[] = [];

    constructor(root: OffsetContainer, padding: Vector2D = new Vector2D(128, 64)) {
        const scrrenSize = new Vector2D(globalThis.innerWidth, globalThis.innerHeight);
        const position = new Vector2D(-scrrenSize.x / 2 + padding.x, scrrenSize.y / 2 - padding.y); // Bottom-left corner

        super(root, position);
        this.padding = padding;

        this.score = new ScoreText(this, "0");
        this.container.label = "ScoreDisplay";

        LayerManager.getLayer("ui")?.attach(this.container);

    }

    public addScore(points: number, score: string) {
        this.score.setText(score);
        this.pushPointText(points);
    }

    private pushPointText(points: number) {
        const size = 48;

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
}