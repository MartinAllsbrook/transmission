import { ExtraMath, GameObject, GameRoot, Vector2D } from "framework";
import { TrickFeedbackText } from "../ui/tricks/TrickFeedbackText.ts";
import { TrickPrecisionText } from "../ui/tricks/TrickPrecisionText.ts";

type TrickPrecision = "Perfect" | "Great" | "Good" | "Okay" | "Poor";

export class TrickManager extends GameObject {
    public override get Name() {
        return "TrickManager";
    }

    // private testText: TrickFeedbackText = new TrickFeedbackText(this, this.root, "Test Trick!");

    // Values for tracking the current trick
    private enterAirTime: number = 0;
    private enterAirAngle: number = 0;
    private enterAirHeading: number = 0;

    private enterAirSwitch: boolean = false;
    private enterAirSlip: number = 0;

    private inTrees: boolean = false;
    private enterTreesTime: number = 0;

    private tricksShown: TrickFeedbackText[] = [];

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
        heading = ExtraMath.radToDeg(heading);

        const airtime = time - this.enterAirTime;
        const rotation = ExtraMath.angleDifference(angle, this.enterAirAngle);

        const isSwitch = this.isSwitch(angle, heading);
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
        if (Math.abs(rotation) >= 120) {
            const spin = Math.round(Math.abs(rotation) / 180) * 180;
            trickText += `${spin.toFixed(0)} `;
        } else {
            trickText += "Air ";
        }

        this.precision(this.determinePrecision(slip), " Landing");
        this.trick(trickText);

        // Reset values
        this.enterAirTime = 0;
        this.enterAirAngle = 0;
        this.enterAirHeading = 0;
    }

    public treeInfo(distanceToTrail: number, numTreesNearby: number): void {
        if (this.inTrees) {
            if (distanceToTrail < 200) {
                const timeInTrees = Date.now() - this.enterTreesTime;
                if (timeInTrees >= 1000) {
                    this.trick("Tree Run");
                }

                this.inTrees = false;
            }
        } else {
            if (distanceToTrail > 250) {
                this.inTrees = true;
                this.enterTreesTime = Date.now();
            }
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

    private trick(text: string): void {
        const height = this.tricksShown.length * 30;
        new TrickFeedbackText(this, this.root, text, new Vector2D(50, height));
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
            trickDisplay.Transform.Position = new Vector2D(50, i * 30);
        }
    }

    // #endregion
}
