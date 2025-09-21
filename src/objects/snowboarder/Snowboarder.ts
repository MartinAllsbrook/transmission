import { GameObject, Parent } from "../GameObject.ts";
import { Vector2D } from "../../math/Vector2D.ts";
import Game from "islands/Game.tsx";
import { LayerManager } from "../../rendering/LayerManager.ts";
import { StatTracker } from "../../scoring/StatTracker.ts";
import { TextManager } from "../../scoring/TextManager.ts";
import { SATCollider } from "../../colliders/SATCollider.ts";
import { Snowboard } from "./Snowboard.ts";
import { Body } from "./Body.ts";
import { ExtraMath } from "../../math/ExtraMath.ts";
import { UpdatingText } from "../text/UpdatingText.ts";
import { ScoringDisplay } from "../text/score/ScoringDisplay.ts";

export class Snowboarder extends GameObject {
    private turnInput: number = 0;
    private jumpInput: boolean = false;
    private shiftyInput: number = 0;

    /** The position of the player in the world, used for world scrolling */
    public worldPosition: Vector2D = new Vector2D(128, 128);

    /** A set of stats to be acessed by the game UI */
    private stats: {
        speed: StatTracker;
        distance: StatTracker;
        score: StatTracker;
    };

    private scoringDisplay: ScoringDisplay;

    /** The current velocity of the player */
    private velocity: Vector2D = new Vector2D(0, 0);

    private rotationRate: number = 0;

    private inAir = false;
    private height: number = 0;

    private timeGoingFast: number = 0; 

    private snowboard: Snowboard;
    private body: Body;


    private shiftyTargetAngle: number = 0;
    private shiftyAngle: number = 0;

    // #region Settings

    private shiftyLerpSpeed: number = 5;
    private maxShiftyAngle: number = 90;
    // #endregion


    private startRotation: number = 0;
    private startRotationSlip: number = 0;
    private rotationText?: UpdatingText;

    constructor(parent: Parent, stats: {
        speed: StatTracker;
        distance: StatTracker;
        score: StatTracker;
    }) {
        super(parent);

        this.stats = stats;

        this.snowboard = new Snowboard(this);
        this.body = new Body(this);

        this.setupInputs();

        LayerManager.getLayer("foreground")?.attach(this.container);
        this.scoringDisplay = TextManager.createScoringDisplay();
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
        if (other.layer === "jump" && !this.InAir) {
            this.height += 1;
        }
    }

    public onCollisionEnd(other: SATCollider): void {
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

        // While in air
            // Snowboarder forward matches body
            // Board becomes rotated by shifty input
        // While on ground
            // Snowboarder forward matches board
            // Body becomes rotated by turn input

        if (this.jumpInput && !this.InAir) {
            this.height += 3;
            this.InAir = true;
        };

        if (this.InAir) {
            this.airUpdate(deltaTime);
        } else {
            this.groundUpdate(deltaTime);
        }   

        this.updatePhysics(deltaTime);

        this.updateStats();


        const speed = this.velocity.magnitude();
        if (speed > 300) {
            this.timeGoingFast += deltaTime;
        } else if (this.timeGoingFast > 2) {
            const points = Math.floor(this.timeGoingFast * 10);
            this.addScore(points);
            this.timeGoingFast = 0;
        }

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
        this.rotationText?.updateText(Math.abs(rotationDiff).toFixed(0));
    }

    private endSpin() {
        const boardRotation = this.snowboard.WorldRotation;
        const heading = this.velocity.heading() * 180 / Math.PI;

        let slip = ExtraMath.angleDifference(boardRotation, heading);
        if (slip > 90) slip -= 180; // account for fakie


        console.log(
            `End Rotation: ${boardRotation}\n`,
            `Slip: ${slip}\n`,
        );


        const rotationDiff = this.startRotation - boardRotation;
        this.rotationText?.updateText(Math.abs(rotationDiff).toFixed(0));
        setTimeout(() => { this.rotationText?.destroy() }, 1000);
    
        this.landSpin(rotationDiff);
    }
    
    private landSpin(spinDegrees: number) {
        const closest90 = Math.round(spinDegrees / 90) * 90;
        this.addScore(Math.abs(Math.floor(closest90)));
    }

    private updateStats() {
        const { speed, distance } = this.stats;

        speed.Value = this.velocity.magnitude();
        distance.Value = this.worldPosition.y;
    }

    private addScore(points: number) {
        this.stats.score.Value += points;

        this.scoringDisplay.addScore(points, this.stats.score.Value.toString());    
    }

    // #endregion

    // #region Physics and Movement

    private updatePhysics(deltaTime: number) {
        const turnStrength = 250;

        if (this.InAir) {
            this.height -= deltaTime;
            if (this.height <= 0) {
                this.height = 0;
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

        this.stats.score.Value = 0;
        this.stats.distance.Value = 0;
        this.stats.speed.Value = 0;
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
