import { TextStyle } from "pixi.js";
import { RichText } from "./RichText.ts";

export class TrickText extends RichText {
    constructor(parent: RichText, content: string) {
        super(parent, content, new TextStyle({
            fontSize: 24,
            fill: "#ffffff",
            fontWeight: "bold",
            fontStyle: "italic",
            stroke: "#000000",
        }));
    }
}