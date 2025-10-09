import { ExtraMath } from "../../../math/ExtraMath.ts";
import { Vector2D } from "../../../math/Vector2D.ts";
import { PlayerState } from "./PlayerState.ts";

export class GroundState extends PlayerState {
    public override enter(): void {
        this.switchToGroundShifty();
        this.tricksManager.endSpin(
            this.player.BoardWorldRotation, 
            this.player.Velocity.heading() * 180 / Math.PI
        );
    }

    private switchToGroundShifty() {
        this.player.ShiftyAngle = this.player.ShiftyAngle * -1;
        this.player.Rotation = this.player.BoardWorldRotation;
        this.player.BodyRotation = this.player.ShiftyAngle + 90; // Flip for goofy
        this.player.BoardRotation = 0; 
    }

    public override shiftyUpdate(deltaTime: number): void {
        this.player.ShiftyTargetAngle = this.player.ShiftyInput * this.player.MaxShiftyAngle;
        this.player.ShiftyAngle = ExtraMath.lerpSafe(this.player.ShiftyAngle, this.player.ShiftyTargetAngle, this.player.ShiftyLerpSpeed * deltaTime);
        this.player.BodyRotation = this.player.ShiftyAngle + 90; // Flip for goofy
    }

    public override physicsUpdate(deltaTime: number): void {
        const frictionStrength = 0.1; // Raising this lowers top speed (max 1)
        const gravityStrength = 140; // Raising this value makes the game feel faster
        const slipStrength = 325; // Raising this value makes turning more responsive

        // Apply gravity
        this.player.Velocity.y += gravityStrength * deltaTime;

        // Rotate
        this.player.RotationRate += (this.player.TurnInput - this.player.RotationRate) * deltaTime * 10;
        
        const radians = (this.player.BoardWorldRotation) * (Math.PI / 180);

        // Normal force
        const forward = Vector2D.fromAngle(radians - Math.PI / 2);
        const direction = this.player.Velocity.normalize();
        const projected = direction.projectOnto(forward);
        const normal = projected.subtract(direction);

        const strength = Math.pow((1 - normal.magnitude()), 2) * 0.25 + 1;
        const normalDirection = projected.subtract(direction).normalize().multiply(strength);

        this.player.Velocity = this.player.Velocity.add(normalDirection.multiply(deltaTime * slipStrength));

        // Friction
        this.player.Velocity = this.player.Velocity.multiply(
            1 - frictionStrength * deltaTime,
        );
    }

    public override exit(): void {

    }
}