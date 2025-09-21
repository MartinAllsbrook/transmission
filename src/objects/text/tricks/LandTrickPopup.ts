import { TextStyle } from "pixi.js";
import { RichText } from "../RichText.ts";
import { GameObject } from "../../GameObject.ts";

export type TrickExecution = "Poor" | "Okay" | "Good" | "Perfect";


export class LandTrickPopup extends RichText {
    constructor(parent: GameObject, content: TrickExecution, duration: number = 1.25){
        let color: string;
        switch(content) {
            case "Poor":
                color = "#ff0000"; // Red
                break;
            case "Okay":
                color = "#ffa500"; // Orange
                break;
            case "Good":
                color = "#00ff00"; // Green
                break;
            case "Perfect":
                color = "#ff00ff"; // Magenta  
                break;
            default:
                color = "#ffffff"; // White
        }

        super(parent, content, new TextStyle({
            fontSize: 30,
            fontWeight: "bold",
            fontStyle: "italic",
            fill: color,
        }), { x: 0.5, y: 0.5 } );

        setTimeout(() => this.destroy(), duration * 1000);
    }
}