import { ExtraMath, GameObject, GameRoot, Vector2D } from "framework";
import { TrickFeedbackText } from "../ui/tricks/TrickFeedbackText.ts";
import { TrickPrecisionText } from "../ui/tricks/TrickPrecisionText.ts";
import { ScoreDisplay } from "../ui/tricks/ScoreDisplay.ts";
import { ComboDisplay } from "../ui/tricks/ComboDisplay.ts";

type TrickPrecision = "Perfect" | "Great" | "Good" | "Okay" | "Poor";

interface TrickRewards {
    time: number,
    score: number,
    multiplier: number,
}

export class TrickManager extends GameObject {
    public override get Name() {
        return "TrickManager";
    }

    // private testText: TrickFeedbackText = new TrickFeedbackText(this, this.root, "Test Trick!");

    private tricksShown: TrickFeedbackText[] = [];

    private scoreDisplay: ScoreDisplay = new ScoreDisplay(this, this.root);
    private comboDisplay: ComboDisplay = new ComboDisplay(this, this.root, this.scoreDisplay);

    // Current combo
    // private combo?: {
    //     startTime: number;
    //     lifetime: number;
    //     multiplier: number;
    //     score: number;
    // } 
    
    // Air Trick Tracking
    private enterAirTime: number = 0;
    private enterAirRotation: number = 0;
    private enterAirAngle: number = 0;
    private enterAirHeading: number = 0;

    private enterAirSwitch: boolean = false;
    private enterAirSlip: number = 0;
    
    // Tree Run Tracking
    private treeRunTrick: TrickFeedbackText | null = null;
    private enterTreesTime: number = 0;
    private treeRunDistance: number = 0;
    
    // Near Miss Tracking
    private nearMissTrick: TrickFeedbackText | null = null;
    private nearMissCount: number = 0;
    private nearMissTimeout: number = 0;

    constructor(
        parent: GameObject,
        root: GameRoot,
    ) {
        super(parent, root);
    }

    protected override update(_deltaTime: number): void {
        this.Transform.WorldRotation = 0;
        this.Transform.WorldScale = new Vector2D(1, 1);
    }

    public enterAir(time: number, angle: number, heading: number): void {
        angle = ExtraMath.radToDeg(angle);
        heading = ExtraMath.radToDeg(heading);

        this.enterAirTime = time;
        this.enterAirRotation = Math.floor(angle / 180) * 180 + heading; // Heading (accounting for number of full board rotations)
        console.log(`Enter Air Rotation: ${this.enterAirRotation.toFixed(2)}`);


        this.enterAirAngle = angle;
        this.enterAirHeading = heading;

        this.enterAirSwitch = this.isSwitch(angle, heading);

        // Slip
        const slip = this.calculateSlip(angle, heading);

        this.precision(this.determinePrecision(slip), " Takeoff");

        this.enterAirSlip = slip;
    }

    public enterGround(time: number, angle: number, heading: number): void {
        const rotationCutoff = 120; // Minimum rotation in degrees to count as a spin trick

        angle = ExtraMath.radToDeg(angle);
        console.log("Enter Ground Rotation: " + angle.toFixed(2));
        heading = ExtraMath.radToDeg(heading);

        const airtime = time - this.enterAirTime;
        const rotation = angle - this.enterAirRotation;

        console.log(`Rotation: ${rotation.toFixed(2)} degrees`);

        const _isSwitch = this.isSwitch(angle, heading);
        const slip = this.calculateSlip(angle, heading);

        let trickText = "";

        // Airtime
        if (airtime >= 1400) {
            trickText += "Massive ";
        } else if (airtime >= 1100) {
            trickText += "Huge ";
        } else if (airtime >= 800) {
            trickText += "Big ";
        } else if (airtime <= 500) {
            trickText += "Quick ";
        }

        // Switch Takeoff
        if (this.enterAirSwitch) {
            trickText += "Switch ";
        }

        // Frontside / Backside
        if (rotation > rotationCutoff) {
            if (this.enterAirSwitch) {
                trickText += "BS ";
            } else {
                trickText += "FS ";
            }
        } else if (rotation < -rotationCutoff) {
            if (this.enterAirSwitch) {
                trickText += "FS ";
            } else {
                trickText += "BS ";
            }
        }

        // Rotation
        const spin = Math.round(Math.abs(rotation) / 180) * 180;
        if (Math.abs(rotation) >= 120) {
            trickText += `${spin.toFixed(0)} `;
        } else {
            trickText += "Air ";
        }

        this.precision(this.determinePrecision(slip), " Landing");
        this.trick(trickText, {
            score: (spin * 2) * (airtime / 1000) + (this.enterAirSwitch ? 30 : 0) + 10, 
            multiplier: 1,
            time: Infinity
        });

        // Reset values
        this.enterAirTime = 0;
        this.enterAirAngle = 0;
        this.enterAirHeading = 0;
    }

    public nearMiss(): void {

        if (this.nearMissTrick) {
            this.nearMissCount += 1;
            this.updateTrick(this.nearMissTrick, "Near Miss! x" + this.nearMissCount, {
                score: 50 * this.nearMissCount,
                multiplier: 0.1,
                time: Infinity,
            });

            clearTimeout(this.nearMissTimeout);
            this.nearMissTimeout = setTimeout(() => {
                this.nearMissTrick = null;
                this.nearMissCount = 0;
            }, 3000);

            return;
        }

        this.nearMissTrick = this.trick("Near Miss!", {
            score: 50,
            multiplier: 0.1,
            time: Infinity, 
        });

        this.nearMissCount = 1;

        this.nearMissTimeout = setTimeout(() => {
            this.nearMissTrick = null;
            this.nearMissCount = 0;
        }, 3000);
    }

    public treeInfo(distanceToTrail: number, speed: number, deltaTime: number): void {
        if (this.treeRunTrick) {
            // Check if player has exited the trees
            if (distanceToTrail < 200 || speed < 75) {
                this.treeRunTrick = null;
                this.treeRunDistance = 0;

                return;
            }

            // Main tree run logic
            // const time = (Date.now() - this.enterTreesTime) / 1000;
            // if (time > 0.1) {
            //     this.treeRunTrick.updateText(`Tree Run! ${time.toFixed(1)}s`);
            // }

            this.treeRunDistance += speed * deltaTime
            const distanceMeeters = this.treeRunDistance / 100;
            const score = Math.floor((distanceMeeters * 10)) * 2;
            this.updateTrick(this.treeRunTrick, `Tree Run! ${distanceMeeters.toFixed(1)}m`, {
                score,
                multiplier: 0.001,
                time: Infinity
            });
            return;
        }

        // Check if player is entering the trees
        if (distanceToTrail > 250 && speed > 80) {
            this.treeRunTrick = this.trick("Tree Run!", {
                score: 0,
                multiplier: 0,
                time: Infinity
            });
            this.enterTreesTime = Date.now();
        }
    }

    //#region Helper Functions

    private isSwitch(boardRotation: number, heading: number): boolean {
        return Math.abs(
            ExtraMath.angleDifference(boardRotation % 360, heading),
        ) > 90;
    }

    private calculateSlip(boardRotation: number, heading: number): number {
        let slip = ExtraMath.angleDifference(boardRotation, heading);
        if (slip > 90) slip -= 180;
        return Math.abs(slip);
    }

    private determinePrecision(slip: number): TrickPrecision {
        slip = Math.abs(slip);
        if (slip > 45) {
            return "Poor";
        } else if (slip > 30) {
            return "Okay";
        } else if (slip > 15) {
            return "Good";
        } else if (slip > 5) {
            return "Great";
        } else {
            return "Perfect";
        }
    }

    //#endregion

    //#region Display Functions

    private precision(precision: TrickPrecision, text: string): void {
        new TrickPrecisionText(this, this.root, precision, text);
    }

    private trick(text: string, rewards: TrickRewards): TrickFeedbackText {
        this.comboDisplay.addScore(rewards.score, rewards.multiplier, rewards.time)
        
        const height = this.tricksShown.length * 30;
        return new TrickFeedbackText(this, this.root, text, rewards.score, new Vector2D(150, height));
    }

    private updateTrick(trickDisplay: TrickFeedbackText, text: string, rewards: TrickRewards): void {
        const scoreDifference = rewards.score - trickDisplay.Score
        
        this.comboDisplay.addScore(scoreDifference, rewards.multiplier, rewards.time)

        trickDisplay.updateText(text, scoreDifference);
    }

    //#endregion

    // #region Display Management

    public addDisplay(display: TrickFeedbackText): void {
        this.tricksShown.push(display);
    }

    public removeDisplay(display: TrickFeedbackText): void {
        const index = this.tricksShown.indexOf(display);
        if (index !== -1) {
            this.tricksShown.splice(index, 1);
        }

        // Reposition remaining displays
        for (let i = 0; i < this.tricksShown.length; i++) {
            const trickDisplay = this.tricksShown[i];
            trickDisplay.Transform.Position = new Vector2D(150, i * 30);
        }
    }

    // #endregion
}
