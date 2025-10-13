import { SATCollider } from "../../../colliders/SATCollider.ts";
import { ExtraMath } from "../../../math/ExtraMath.ts";
import { PlayerState, StateName } from "./PlayerState.ts";

export class RailState extends PlayerState {
    private exitRail: boolean = false;

    public override enter(): void {
        this.switchToRailShifty();
    }

    private switchToRailShifty() {
        this.player.Rotation = this.body.WorldRotation - 90; 
        this.board.Rotation = this.shiftyAngle;
        this.body.Rotation = 0 + 90; 
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

        this.player.Rotation += this.deltaRotation * deltaTime * this.config.rotationSpeed;

        // Update position
        this.player.PhysicalPosition.set(
            this.player.PhysicalPosition.add(this.velocity.multiply(deltaTime)),
        );
    }

    protected override checkTransitions(): StateName | void {
        if (this.inputs.jump) {
            this.deltaHeight += this.config.jumpStrength;
            this.exitRail = false;
            return "air";
        }

        if (this.exitRail) {
            this.exitRail = false;
            return "air";
        }
    }

    public override onCollisionExit(other: SATCollider): void {
        if (other.layer === "rail") {
            this.exitRail = true;
        }
    }

    public override get StateName(): StateName {
        return "rail";
    }
}