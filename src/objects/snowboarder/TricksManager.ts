import { TrickDisplay } from "../text/tricks/TrickDisplay.ts";
import { Snowboarder } from "./Snowboarder.ts";
import { UpdatingText } from "../text/UpdatingText.ts";
import { TrickPopup } from "../text/tricks/TrickPopup.ts";
import { ScoringDisplay } from "../text/score/ScoringDisplay.ts";
import { TextManager } from "../../scoring/TextManager.ts";
import { ExtraMath } from "../../math/ExtraMath.ts";

export class TricksManager {
    private snowboarder: Snowboarder;

    // UI / Displays
    private display: TrickDisplay;
    private rotationText?: UpdatingText;
    private scoringDisplay: ScoringDisplay;
    
    private rotationTrick?: TrickPopup;
    private airTimeTrick?: TrickPopup;
    
    // State
    private score: number = 0;
    private startRotation: number = 0;
    private airTime: number = 0;
    
    private timeGoingFast: number = 0; 
    private takeoffSlip: number = 0;

    private switch: boolean = false;
    
    constructor(snowboarder: Snowboarder) {
        this.snowboarder = snowboarder;
        this.display = TextManager.createTrickDisplay();
        this.scoringDisplay = TextManager.createScoringDisplay();
    }
    
    public trickStart(boardRotation: number, heading: number) {
        this.switch = Math.abs(ExtraMath.angleDifference(boardRotation + 90 % 360, heading)) > 90
        this.rotationText = TextManager.createUpdatingText(`Rotation`, `0`, "#FF00FF", 2);
        this.takeoffSlip = this.calculateTakeoffSlip(boardRotation, heading);
        this.startRotation = Math.floor(boardRotation / 360) * 360 + heading; // Heading (accounting for number of full board rotations)
    }

    private calculateTakeoffSlip(boardRotation: number, heading: number) {
        let slip = ExtraMath.angleDifference(boardRotation, heading);
        if (slip > 90) slip -= 180;
        return slip;
    }

    public trickUpdate(deltaTime: number, boardRotation: number, _heading: number) {
        const rotationDiff = this.startRotation - boardRotation;

        this.rotationText?.updateText(Math.abs(rotationDiff).toFixed(0));

        this.airTime += deltaTime;
        if (this.airTime > 0.5) {
            const airTimeTrickText = `Air Time: ${this.airTime.toFixed(1)}s`;

            if (!this.airTimeTrick || this.airTimeTrick?.Destroyed){
                this.airTimeTrick = this.display.addTrick(airTimeTrickText);
            } else if (this.airTimeTrick.getText() !== airTimeTrickText) {
                this.airTimeTrick.setText(airTimeTrickText);
            }
        } 

        this.updateSpinTrick(rotationDiff);
    }

    private updateSpinTrick(rotationDiff: number) {
        const closest90 = Math.round(rotationDiff / 180) * 180;
        
        if (Math.abs(closest90) < 180)
            return;

        let frontside: boolean;
        if (rotationDiff > 0) {
            frontside = !this.switch;
        } else {
            frontside = this.switch;
        }

        const trickText = `${this.switch ? "Switch " : ""}${frontside ? "Frontside " : "Backside "}${Math.abs(closest90)}Spin`;

        if (!this.rotationTrick || this.rotationTrick?.Destroyed) {
            this.rotationTrick = this.display.addTrick(trickText);
        } else if (this.rotationTrick.getText() !== trickText) {
            this.rotationTrick.setText(trickText);
        }
    }

    public endSpin(boardRotation: number, heading: number) {
        const rotationDiff = this.startRotation - boardRotation;
        this.rotationText?.updateText(Math.abs(rotationDiff).toFixed(0));
        setTimeout(() => { this.rotationText?.destroy() }, 1000);
        
        this.airTime = 0;
        const closest90 = Math.round(rotationDiff / 180) * 180;
        
        const slip = this.calculateLandingSlip(boardRotation, heading);
        this.showLandingQuality(slip);

        this.addScore(Math.abs(Math.floor(closest90)));
    }

    private calculateLandingSlip(boardRotation: number, heading: number) {
        let slip = ExtraMath.angleDifference(boardRotation, heading);
        if (slip > 90) slip -= 180; // account for fakie
        return slip;
    }

    private showLandingQuality(slip: number) {       
        slip = Math.abs(slip);
        
        if (slip > 40) {
            this.display.landTrick("Poor");
        } else if (slip > 20) {
            this.display.landTrick("Okay");
        } else if (slip > 10) {
            this.display.landTrick("Good");
        } else {
            this.display.landTrick("Perfect");
        }
    }

    public addScore(points: number) {
        this.score += points;
        this.scoringDisplay.addScore(points, this.score.toString());    
    }

    public reset() {
        this.score = 0;
        this.startRotation = 0;
        this.airTime = 0;
        this.timeGoingFast = 0; 
        this.takeoffSlip = 0;
    }
}