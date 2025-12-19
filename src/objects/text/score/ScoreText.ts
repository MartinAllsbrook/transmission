import { TextStyle } from "pixi.js";
import { GameObject } from "framework";
import { RichText } from "../RichText.ts";

export class ScoreText extends RichText {
    constructor(parent: GameObject, content: string) {
        const style = new TextStyle({
            fontFamily: "Arial",
            fontSize: 64,
            fill: "#ffd700",
            fontWeight: "bold",
        })
        
        super(parent, content, style);
        this.container.label = "ScoreText";
    }
}