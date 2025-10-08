import { ExtraMath } from "../../../math/ExtraMath.ts";
import { Vector2D } from "../../../math/Vector2D.ts";
import { State } from "./State.ts";

export class GroundState extends State {
    public override enter(): void {
        this.switchToGroundShifty();
        this.tricksManager.endSpin(
            this.snowboarder.BoardWorldRotation, 
            this.data.velocity.heading() * 180 / Math.PI
        );
    }

    private switchToGroundShifty() {
        this.data.shiftyAngle = this.data.shiftyAngle * -1;
        this.snowboarder.Rotation = this.snowboarder.BoardWorldRotation;
        this.snowboarder.BodyRotation = this.data.shiftyAngle + 90; // Flip for goofy
        this.snowboarder.BoardRotation = 0; 
    }

    public override shiftyUpdate(deltaTime: number): void {
        this.data.shiftyTargetAngle = this.input.shifty * this.settings.maxShiftyAngle;
        this.data.shiftyAngle = ExtraMath.lerpSafe(this.data.shiftyAngle, this.data.shiftyTargetAngle, this.settings.shiftyLerpSpeed * deltaTime);
        this.snowboarder.BodyRotation = this.data.shiftyAngle + 90; // Flip for goofy
    }

    public override physicsUpdate(deltaTime: number): void {        
        const frictionStrength = 0.1; // Raising this lowers top speed (max 1)
        const gravityStrength = 140; // Raising this value makes the game feel faster
        const slipStrength = 325; // Raising this value makes turning more responsive

        // Apply gravity
        this.data.velocity.y += gravityStrength * deltaTime;

        // Rotate
        this.data.rotationRate += (this.input.turn - this.data.rotationRate) * deltaTime * 10;
        
        const radians = (this.snowboarder.BoardWorldRotation) * (Math.PI / 180);

        // Normal force
        const forward = Vector2D.fromAngle(radians - Math.PI / 2);
        const direction = this.data.velocity.normalize();
        const projected = direction.projectOnto(forward);
        const normal = projected.subtract(direction);

        const strength = Math.pow((1 - normal.magnitude()), 2) * 0.25 + 1;
        const normalDirection = projected.subtract(direction).normalize().multiply(strength);

        this.data.velocity = this.data.velocity.add(normalDirection.multiply(deltaTime * slipStrength));

        // Friction
        this.data.velocity = this.data.velocity.multiply(
            1 - frictionStrength * deltaTime,
        );
    }

    public override exit(): void {

    }
}