import Game from "islands/Game.tsx";
import { ExtraMath } from "../../../math/ExtraMath.ts";
import { PlayerState, StateName } from "./PlayerState.ts";
import { SATCollider } from "../../../colliders/SATCollider.ts";

export class AirState extends PlayerState {
    private overRail: boolean = false;

    public override enter(): void {
        this.switchToAirShifty();
        this.tricksManager.trickStart(
            this.board.WorldRotation, 
            this.velocity.heading() * 180 / Math.PI
        );
    }

    private switchToAirShifty() {
        this.player.Rotation = this.body.WorldRotation - 90; // Flip for goofy
        this.board.Rotation = this.shiftyAngle;
        this.body.Rotation = 0 + 90; // Flip for goofy
    }

    //#region Update

    public override update(deltaTime: number): void {
        super.update(deltaTime);

        this.tricksManager.trickUpdate(
            deltaTime,
            this.board.Rotation, 
            this.velocity.heading() * 180 / Math.PI
        );
    }

    protected override shiftyUpdate(deltaTime: number): void {
        this.shiftyTargetAngle = this.inputs.shifty * this.config.shiftyMaxAngle;
        this.shiftyAngle = ExtraMath.lerpSafe(
            this.shiftyAngle, 
            this.shiftyTargetAngle, 
            this.config.shiftyLerpSpeed * deltaTime
        );
        
        this.board.Rotation = this.shiftyAngle;
    }

    protected override physicsUpdate(deltaTime: number): void {
        this.deltaHeight -= 16  * deltaTime;
        this.player.Height += this.deltaHeight * deltaTime;
        
        if (this.player.Height < 0) {
            this.player.Height = 0;
        }

        this.player.Rotation += this.deltaRotation * deltaTime * this.config.rotationSpeed;

        // Update position
        this.player.PhysicalPosition.set(
            this.player.PhysicalPosition.add(this.velocity.multiply(deltaTime)),
        );
    }

    protected override checkTransitions(): StateName | void {
        if (this.player.Height <= 0) {
            this.player.Height = 0;
            this.deltaHeight = 0;
            
            if (this.overRail) {
                return "rail";
            } else {
                return "ground";
            }
        }
    }

    //#endregion

    //#region Collisions

    public override onCollisionEnter(other: SATCollider): void {
        if (other.layer === "obstacle") {
            Game.endGame("You crashed into an obstacle!");
        }

        if (other.layer === "rail") {
            this.overRail = true;
        }
    }

    public override onCollisionExit(other: SATCollider): void {
        if (other.layer === "rail") {
            this.overRail = false;
        }
    }

    //#endregion

    public override get StateName(): StateName {
        return "air";
    }
}