import { GameObject, GameRoot, Vector2D } from "framework";
import { Text } from "pixi.js";
import { TrickManager } from "../../player/TrickManager.ts";
import { ScoreDisplay } from "./ScoreDisplay.ts";

interface Combo {
    timeRemaining: number;
    score: number;
    multiplier: number; 
}

export class ComboDisplay extends GameObject {
    public override get Name(): string {
        return "Combo";
    }

    public override get layer(): string {
        return "ui";
    }

    private scoreDisplay: ScoreDisplay;

    private maxComboLifetime: number = 2.5;

    private currentCombo?: {
        timeRemaining: number;
        score: number;
        multiplier: number;
    }

    private mainText: Text;
    private topText: Text;

    constructor(
        parent: TrickManager,
        root: GameRoot,
        scoreDisplay: ScoreDisplay,
    ) {
        super(parent, root, {
            position: new Vector2D(150, 0),
        });

        this.scoreDisplay = scoreDisplay;

        [this.mainText, this.topText] = this.createText();

        this.mainText.text = "";
        this.topText.text = "";

        this.addGraphics(this.mainText);
        this.addGraphics(this.topText, { position: new Vector2D(0, -this.mainText.height)});
    }

    private createText(): [Text, Text] {
        const mainText = new Text();
        mainText.anchor.set(0, 1);
        mainText.style.fontFamily = "Arial";
        mainText.style.fontSize = 32;
        mainText.style.fontWeight = "bold";
        mainText.style.fontStyle = "italic";
        mainText.style.fill = 0xFFF000;

        const topText = new Text();
        topText.anchor.set(0, 1);
        topText.style.fontFamily = "Arial";
        topText.style.fontSize = 16;
        topText.style.fontStyle = "italic";
        topText.style.fill = 0xFFF000;

        return [mainText, topText];
    }

    protected override update(deltaTime: number): void {
        if (!this.currentCombo) 
            return;

        this.currentCombo.timeRemaining -= deltaTime;
        if (this.currentCombo.timeRemaining < 0) {
            this.finishCombo();
            return;
        }

        this.setText(this.currentCombo)
    }

    public addScore(score: number, multiplier: number, time: number) {
        if (!this.currentCombo) {
            this.currentCombo = {
                timeRemaining: this.maxComboLifetime,
                score,
                multiplier: (1 + multiplier),
            }
        } else {
            this.currentCombo.timeRemaining += time;
            if (this.currentCombo.timeRemaining > this.maxComboLifetime) {
                this.currentCombo.timeRemaining = this.maxComboLifetime;
            }

            this.currentCombo.score += score;
            this.currentCombo.multiplier += multiplier;
        }
    }

    private finishCombo() {
        if (!this.currentCombo) return
        this.scoreDisplay.addScore(this.currentCombo?.score * this.currentCombo?.multiplier)

        this.currentCombo = undefined;
        this.clearText();
    }
    
    private setText(combo?: Combo) {
        if (!combo) {
            this.mainText.text = "";
            this.topText.text = "";
            return;
        }
        this.mainText.text = `${combo.score.toFixed(0)} x${combo.multiplier.toFixed(1)}`;
        this.topText.text = `${combo.timeRemaining.toFixed(1)}s`
    }

    private clearText() {
        this.mainText.text = "";
        this.topText.text = "";
    }

    public get Score() {
        return this.currentCombo?.score || 0;
    }
}