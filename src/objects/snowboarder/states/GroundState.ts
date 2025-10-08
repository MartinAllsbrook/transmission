import { ExtraMath } from "../../../math/ExtraMath.ts";
import { Vector2D } from "../../../math/Vector2D.ts";
import { State } from "./State.ts";

export class GroundState extends State {
    public override enter(): void {
        const player = this.snowboarder;

        this.switchToGroundShifty();
        this.tricksManager.endSpin(
            player.BoardWorldRotation, 
            player.Velocity.heading() * 180 / Math.PI
        );
    }

    private switchToGroundShifty() {
        const player = this.snowboarder;

        player.ShiftyAngle = player.ShiftyAngle * -1;
        player.Rotation = player.BoardWorldRotation;
        player.BodyRotation = player.ShiftyAngle + 90; // Flip for goofy
        player.BoardRotation = 0; 
    }

    public override shiftyUpdate(deltaTime: number): void {
        const player = this.snowboarder;

        player.ShiftyTargetAngle = player.ShiftyInput * player.MaxShiftyAngle;
        player.ShiftyAngle = ExtraMath.lerpSafe(player.ShiftyAngle, player.ShiftyTargetAngle, player.ShiftyLerpSpeed * deltaTime);
        player.BodyRotation = player.ShiftyAngle + 90; // Flip for goofy
    }

    public override physicsUpdate(deltaTime: number): void {
        const player = this.snowboarder;
        
        const frictionStrength = 0.1; // Raising this lowers top speed (max 1)
        const gravityStrength = 140; // Raising this value makes the game feel faster
        const slipStrength = 325; // Raising this value makes turning more responsive

        // Apply gravity
        player.Velocity.y += gravityStrength * deltaTime;

        // Rotate
        player.RotationRate += (player.TurnInput - player.RotationRate) * deltaTime * 10;
        
        const radians = (player.BoardWorldRotation) * (Math.PI / 180);

        // Normal force
        const forward = Vector2D.fromAngle(radians - Math.PI / 2);
        const direction = player.Velocity.normalize();
        const projected = direction.projectOnto(forward);
        const normal = projected.subtract(direction);

        const strength = Math.pow((1 - normal.magnitude()), 2) * 0.25 + 1;
        const normalDirection = projected.subtract(direction).normalize().multiply(strength);

        player.Velocity = player.Velocity.add(normalDirection.multiply(deltaTime * slipStrength));

        // Friction
        player.Velocity = player.Velocity.multiply(
            1 - frictionStrength * deltaTime,
        );
    }

    public override exit(): void {

    }
}