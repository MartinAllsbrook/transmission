import { GameObject, Parent } from "../GameObject.ts";
import { Vector2D } from "../../math/Vector2D.ts";
import Game from "islands/Game.tsx";
import { LayerManager } from "../../rendering/LayerManager.ts";
import { TextManager } from "../../scoring/TextManager.ts";
import { SATCollider } from "../../colliders/SATCollider.ts";
import { Snowboard } from "./Snowboard.ts";
import { Body } from "./Body.ts";
import { ExtraMath } from "../../math/ExtraMath.ts";
import { UpdatingText } from "../text/UpdatingText.ts";
import { ScoringDisplay } from "../text/score/ScoringDisplay.ts";
import { TrickDisplay } from "../text/tricks/TrickDisplay.ts";
import { TrickPopup } from "../text/tricks/TrickPopup.ts";
import { Shadow } from "./Shadow.ts";
  
export class Snowboarder extends GameObject {
    // Inputs
    private turnInput: number = 0;
    private jumpInput: boolean = false;
    private shiftyInput: number = 0;
        
    /** The position of the player in the world, used for world scrolling */
    public worldPosition: Vector2D = new Vector2D(128, 128);
    
    // Physics & State
    private velocity: Vector2D = new Vector2D(0, 0);
    private rotationRate: number = 0;
    
    private inAir = false;
    private vericalVelocity: number = 0;
    private height: number = 0;
    
    // Shifty
    private shiftyTargetAngle: number = 0;
    private shiftyAngle: number = 0;    
    private shiftyLerpSpeed: number = 3;
    private maxShiftyAngle: number = 90;
    
    // Components
    private shadow: Shadow;
    private snowboard: Snowboard;
    private body: Body;
    
    // Scoring
    private score: number = 0;
    private timeGoingFast: number = 0; 
    private startRotation: number = 0;
    private startRotationSlip: number = 0;
    private rotationText?: UpdatingText;
    private currentSpinTrickPopup?: TrickPopup;
    private scoringDisplay: ScoringDisplay;
    private trickDisplay: TrickDisplay;

    constructor(parent: Parent) {
        super(parent);

        this.shadow = new Shadow(parent);
        this.snowboard = new Snowboard(this);
        this.body = new Body(this);


        this.setupInputs();

        LayerManager.getLayer("foreground")?.attach(this.container);
        this.scoringDisplay = TextManager.createScoringDisplay();
        this.trickDisplay = TextManager.createTrickDisplay();
    }

    private async setupInputs() {
        const { InputManager } = await import("src/inputs/InputManager.ts");

        InputManager.getInput("turn").subscribe((newValue) => {
            this.turnInput = newValue;
        });

        InputManager.getInput("jump").subscribe((newValue) => {
            this.jumpInput = newValue;
        });

        InputManager.getInput("shifty").subscribe((newValue) => {
            this.shiftyInput = newValue;
        });
    }

    public onCollisionStart(other: SATCollider): void {
        if (other.layer === "obstacle") {
            if (this.velocity.magnitude() > 10) {
                Game.endGame();
            }
            
            this.velocity = this.velocity.multiply(-0.5);
        }

        // If we hit a jump and we're not already in the air, add some height and velocity - wont be used until we enter the air
        if (other.layer === "jump" && !this.InAir) {
            this.height += 1;
            this.vericalVelocity = this.velocity.magnitude() * 0.0075;
        }
    }

    public onCollisionEnd(other: SATCollider): void {
        // At the end of a jump if the player isnt in the air, put them in the air
        if (other.layer === "jump" && !this.InAir) {
            this.InAir = true;
        }
    }

    // TODOs:
        // - Snowboarder scaling on jump
        // - Gain height the longer you're on a jump
        // - Add shifties to control air rotation
        // - Add points
        // - Add some momentum upwards when hitting a jump at speed

    public override update(deltaTime: number): void {
        if (this.jumpInput && !this.InAir) { // Jump
            this.vericalVelocity += 4;
            this.InAir = true;
        };
        
        if (this.InAir) {
            this.airUpdate(deltaTime);
        } else {
            this.groundUpdate(deltaTime);
        }   
        
        this.updatePhysics(deltaTime); // 2D physics

        const speed = this.velocity.magnitude();
        if (speed > 300) {
            this.timeGoingFast += deltaTime;
        } else if (this.timeGoingFast > 2) {
            const points = Math.floor(this.timeGoingFast * 10);
            this.addScore(points);
            this.timeGoingFast = 0;
        }

        this.scale = new Vector2D(1 + this.height * 0.15, 1 + this.height * 0.15);
        this.shadow.setEffects(this.height, this.snowboard.WorldRotation);

        super.update(deltaTime);
    }


    // #region Air

    private onEnterAir() {
        this.switchToAirShifty();
        this.startSpin();
    }

    private airUpdate(deltaTime: number) {
        this.applyAirShiftyUpdate(deltaTime);
        this.spinUpdate();
    }

    // #endregion

    // #region Ground

    private onEnterGround() {
        this.switchToGroundShifty();
        this.endSpin();
    }

    private groundUpdate(deltaTime: number) {
        this.applyGroundShiftyUpdate(deltaTime);
    }

    // #endregion

    // #region Shifty

    private switchToAirShifty() {
        this.shiftyAngle = this.shiftyAngle * -1;
        this.rotation = this.body.WorldRotation - 90; // Flip for goofy
        this.snowboard.Rotation = this.shiftyAngle;
        this.body.Rotation = 0 + 90; // Flip for goofy
    }

    private applyAirShiftyUpdate(deltaTime: number) {
        this.shiftyTargetAngle = this.shiftyInput * -this.maxShiftyAngle;
        this.shiftyAngle = ExtraMath.lerpSafe(this.shiftyAngle, this.shiftyTargetAngle, this.shiftyLerpSpeed * deltaTime);
    }

    private switchToGroundShifty() {
        this.shiftyAngle = this.shiftyAngle * -1;
        this.rotation = this.snowboard.WorldRotation;
        this.body.Rotation = this.shiftyAngle + 90; // Flip for goofy
        this.snowboard.Rotation = 0; 
    }

    private applyGroundShiftyUpdate(deltaTime: number) {
        this.shiftyTargetAngle = this.shiftyInput * this.maxShiftyAngle;
        this.shiftyAngle = ExtraMath.lerpSafe(this.shiftyAngle, this.shiftyTargetAngle, this.shiftyLerpSpeed * deltaTime);
        this.body.Rotation = this.shiftyAngle + 90; // Flip for goofy
    }

    // #endregion

    // #region Scoring & Stats

    private startSpin() {
        this.rotationText = TextManager.createUpdatingText(`Rotation`, `0`, "#FF00FF", 2);

        const boardRotation = this.snowboard.WorldRotation;
        const heading = this.velocity.heading() * 180 / Math.PI;

        let slip = ExtraMath.angleDifference(boardRotation, heading);
        if (slip > 90) slip -= 180; // account for fakie

        this.startRotationSlip = slip;
        this.startRotation = Math.floor(boardRotation / 360) * 360 + heading;

        console.log(
            `Start Rotation: ${this.startRotation}\n`,
            `Slip: ${slip}\n`,
        );
    }

    private spinUpdate() {
        this.snowboard.Rotation = this.shiftyAngle;
        const rotationDiff = this.startRotation - this.snowboard.WorldRotation;

        const boardRotation = this.snowboard.WorldRotation;
        const heading = this.velocity.heading() * 180 / Math.PI;

        let slip = ExtraMath.angleDifference(boardRotation, heading);
        if (slip > 90) slip -= 180; // account for fakie

        this.rotationText?.updateText(Math.abs(slip).toFixed(0));

        const closest90 = Math.round(rotationDiff / 180) * 180;
        if (Math.abs(closest90) >= 180) {
            if (!this.currentSpinTrickPopup) {
                this.currentSpinTrickPopup = this.trickDisplay.addTrick(`${Math.abs(closest90)} Spin`);
            } else if (this.currentSpinTrickPopup.getText() !== `${Math.abs(closest90)} Spin`) {
                this.currentSpinTrickPopup.setText(`${Math.abs(closest90)} Spin`);
            }
        }
    }

    private endSpin() {
        const boardRotation = this.snowboard.WorldRotation;
        const heading = this.velocity.heading() * 180 / Math.PI;

        let slip = ExtraMath.angleDifference(boardRotation, heading);
        if (slip > 90) slip -= 180; // account for fakie


        console.log(
            `Board Rotation: ${boardRotation.toFixed(2)} Heading: ${heading.toFixed(2)}\n`,
            `Slip: ${slip}\n`,
        );


        const rotationDiff = this.startRotation - boardRotation;
        this.rotationText?.updateText(Math.abs(slip).toFixed(0));
        setTimeout(() => { this.rotationText?.destroy() }, 1000);
    
        this.landSpin(rotationDiff, slip);
    }
    
    private landSpin(spinDegrees: number, slip: number) {
        const closest90 = Math.round(spinDegrees / 180) * 180;
        this.addScore(Math.abs(Math.floor(closest90)));

        slip = Math.abs(slip);

        if (slip > 40) {
            this.trickDisplay.landTrick("Poor");
        } else if (slip > 20) {
            this.trickDisplay.landTrick("Okay");
        } else if (slip > 10) {
            this.trickDisplay.landTrick("Good");
        } else {
            this.trickDisplay.landTrick("Perfect");
        }
    }

    private addScore(points: number) {
        this.score += points;
        this.scoringDisplay.addScore(points, this.score.toString());    
    }

    // #endregion

    // #region Physics and Movement

    private updatePhysics(deltaTime: number) {
        const turnStrength = 250;

        if (this.InAir) {
            this.vericalVelocity -= 16  * deltaTime;
            this.height += this.vericalVelocity * deltaTime;

            if (this.height <= 0) {
                this.height = 0;
                this.vericalVelocity = 0;
                this.InAir = false;
            }
        } else {
            const frictionStrength = 0.1; // Raising this lowers top speed (max 1)
            const gravityStrength = 140; // Raising this value makes the game feel faster
            const slipStrength = 325; // Raising this value makes turning more responsive
    
            // Apply gravity
            this.velocity.y += gravityStrength * deltaTime;
    
            // Rotate
            this.rotationRate += (this.turnInput - this.rotationRate) * deltaTime * 10;
            
            const radians = (this.snowboard.WorldRotation) * (Math.PI / 180);
    
            // Normal force
            const forward = Vector2D.fromAngle(radians - Math.PI / 2);
            const direction = this.velocity.normalize();
            const projected = direction.projectOnto(forward);
            const normal = projected.subtract(direction);
    
            const strength = Math.pow((1 - normal.magnitude()), 2) * 0.25 + 1;
            const normalDirection = projected.subtract(direction).normalize().multiply(strength);
    
            this.velocity = this.velocity.add(normalDirection.multiply(deltaTime * slipStrength));
    
            // Friction
            this.velocity = this.velocity.multiply(
                1 - frictionStrength * deltaTime,
            );
        }

        this.rotation += this.rotationRate * deltaTime * turnStrength;

        // Update position
        this.worldPosition.set(
            this.worldPosition.add(this.velocity.multiply(deltaTime)),
        );
    }

    // #endregion

    public reset() {
        this.worldPosition.set(new Vector2D(128, 128));
        this.velocity.set(new Vector2D(0, 0));
        this.rotation = 0;

        this.score = 0;
    }

    public override get WorldPosition(): Vector2D {
        return this.worldPosition.clone();
    }

    public get Velocity(): Vector2D {
        return this.velocity.clone();
    }

    public get InAir(): boolean {
        return this.inAir;
    }

    public set InAir(value: boolean) {
        if (this.inAir === value) return;

        this.inAir = value;
   
        if (this.inAir) {
            this.onEnterAir();
        } else {
            this.onEnterGround();
        }     
    }
}
