import { ExtraMath, Vector2D } from "framework";
import { PlayerState, StateName } from "./PlayerState.ts";
import { PLAYER_CONFIG } from "../PlayerConfig.ts";

export class GroundState extends PlayerState {
    private switchToAir: boolean = false;

    public override enter(): void {
        this.switchToGroundShifty();
        // this.tricksManager.endSpin(
        //     this.board.Transform.WorldRotation, 
        //     this.velocity.heading() * 180 / Math.PI
        // );
    }

    private switchToGroundShifty() {
        // Rotation of the root object now matches the board
        this.player.Transform.Rotation = this.board.Transform.WorldRotation;

        // Rotation of the body is now offset to match the now flipped shifty. 90 is for the base stance of the body 
        this.body.Transform.Rotation.Deg = (this.player.ShiftyAngle.Deg * -1) + 90; 

        // Reset board rotation because it is now handled by the root object
        this.board.Transform.Rotation.Deg = 0; 
    }

    // #region Update

    public override update(_deltaTime: number): void {
        this.shiftyUpdate(_deltaTime);
        this.physicsUpdate(_deltaTime);
    }

    protected shiftyUpdate(deltaTime: number): void {
        const shiftyTargetAngle = this.player.ShiftyInput.Value * PLAYER_CONFIG.shiftyMaxAngle;
        this.player.ShiftyAngle.Deg = ExtraMath.lerpSafe(
            this.player.ShiftyAngle.Deg, 
            shiftyTargetAngle, 
            PLAYER_CONFIG.shiftyLerpSpeed * deltaTime
        );
        
        this.body.Transform.Rotation.Rad = (this.player.ShiftyAngle.Rad * -1) + 90; // Flip for goofy
    }

    protected physicsUpdate(deltaTime: number): void {
        // Apply gravity
        this.player.Velocity.Y += PLAYER_CONFIG.gravityStrength * deltaTime

        // Rotate
        this.player.RotationSpeed.Deg += (this.player.RotationInput.Value - this.player.RotationSpeed.Deg) * deltaTime * 10;
        
        // Normal force
        const forward = Vector2D.fromAngle(this.board.Transform.WorldRotation.Rad - Math.PI / 2); // TODO: Make FromAngle use Angle type, make separate from Deg and Rad medthods
        const direction = this.player.Velocity.normalize();
        const projected = direction.projectOnto(forward);
        const normal = projected.subtract(direction);

        const strength = Math.pow((1 - normal.magnitude()), 2) * 0.25 + 1;
        const normalDirection = projected.subtract(direction).normalize().multiply(strength);

        this.player.Velocity = this.player.Velocity.add(normalDirection.multiply(deltaTime * PLAYER_CONFIG.slipStrength));

        // Friction
        this.player.Velocity = this.player.Velocity.multiply(1 - PLAYER_CONFIG.frictionStrength * deltaTime);

        this.player.Transform.Rotation.Rad += this.player.RotationSpeed.Rad * deltaTime;

        // Update position
        this.player.Transform.Position.set(
            this.player.Transform.Position.add(this.player.Velocity.multiply(deltaTime)),
        );
    }

    public override get StateName(): StateName {
        return "ground";
    }

    // #endregion
}