import { SATCollider, ExtraMath } from "framework";
import { Rail } from "../../world/features/Rail.ts";
import { PlayerState, StateName } from "./PlayerState.ts";

export class RailState extends PlayerState {
    private exitRail: boolean = false;
    private rail: Rail | null = null;

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
        if (this.rail) {
            const railDirection = this.rail.getDirection();
            const normal = railDirection.perpendicular().normalize();            
            const playerDirection = this.velocity.normalize();
            const misalignment = normal.dot(playerDirection);
            
            const sign = misalignment < 0 ? 1 : -1; // Flip sign so correction pushes player toward rail center

            // Move playerDirection towards railDirection using the normal
            const correctionStrength = sign * this.config.railCorrectionStrength;
            this.velocity = this.velocity.add(normal.multiply(correctionStrength));
        }


        this.player.Rotation += this.deltaRotation * deltaTime * this.config.rotationSpeed;

        // Gravity & Friction
        this.velocity.y += this.config.gravityStrength * deltaTime
        this.velocity = this.velocity.multiply(1 - this.config.frictionStrength * deltaTime);
        
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

    public override onCollisionStay(other: SATCollider): void {
        if (other.layer === "rail") {
            this.rail = other.Host as Rail;
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