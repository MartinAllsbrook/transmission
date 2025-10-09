import { ExtraMath } from "../../../math/ExtraMath.ts";
import { Vector2D } from "../../../math/Vector2D.ts";
import { PlayerState, StateName } from "./PlayerState.ts";

export class GroundState extends PlayerState {
    public override enter(): void {
        this.switchToGroundShifty();
        this.tricksManager.endSpin(
            this.board.WorldRotation, 
            this.velocity.heading() * 180 / Math.PI
        );
    }

    private switchToGroundShifty() {
        this.shiftyAngle = this.shiftyAngle * -1;
        this.player.Rotation = this.board.WorldRotation;
        this.body.Rotation = this.shiftyAngle + 90; // Flip for goofy
        this.board.Rotation = 0; 
    }

    // #region Update

    public override shiftyUpdate(deltaTime: number): void {
        this.shiftyTargetAngle = this.inputs.shifty * this.config.shiftyMaxAngle;
        this.shiftyAngle = ExtraMath.lerpSafe(this.shiftyAngle, this.shiftyTargetAngle, this.config.shiftyLerpSpeed * deltaTime);
        this.body.Rotation = this.shiftyAngle + 90; // Flip for goofy
    }

    public override physicsUpdate(deltaTime: number): void {
        // Apply gravity
        this.velocity = new Vector2D(
            this.velocity.x,
            this.velocity.y + this.config.gravityStrength * deltaTime,
        )

        // Rotate
        this.deltaRotation += (this.inputs.turn - this.deltaRotation) * deltaTime * 10;
        
        const radians = (this.board.WorldRotation) * (Math.PI / 180);

        // Normal force
        const forward = Vector2D.fromAngle(radians - Math.PI / 2);
        const direction = this.velocity.normalize();
        const projected = direction.projectOnto(forward);
        const normal = projected.subtract(direction);

        const strength = Math.pow((1 - normal.magnitude()), 2) * 0.25 + 1;
        const normalDirection = projected.subtract(direction).normalize().multiply(strength);

        this.velocity = this.velocity.add(normalDirection.multiply(deltaTime * this.config.slipStrength));

        // Friction
        this.velocity = this.velocity.multiply(
            1 - this.config.frictionStrength * deltaTime,
        );

        this.player.Rotation += this.deltaRotation * deltaTime * this.config.rotationSpeed;

        // Update position
        this.player.PhysicalPosition.set(
            this.player.PhysicalPosition.add(this.velocity.multiply(deltaTime)),
        );
    }

    protected override checkTransitions(): StateName | void {
        if (this.inputs.jump) {
            this.deltaHeight += this.config.jumpStrength;
            return "air";
        }
    }

    public override get StateName(): StateName {
        return "ground";
    }

    // #endregion
}