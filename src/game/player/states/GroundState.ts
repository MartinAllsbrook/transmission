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
        this.body.Transform.Rotation = (this.player.ShiftyAngle * -1) + ExtraMath.degToRad(90); 

        // Reset board rotation because it is now handled by the root object
        this.board.Transform.Rotation = 0; 
    }

    // #region Update

    public override update(deltaTime: number): void {
        
        // this.player.Transform.Position = this.player.Transform.Position.add(new Vector2D(_deltaTime, 0)); // Ensure position is synced
        
        // this.shiftyUpdate(deltaTime);
        this.physicsUpdate(deltaTime);
        // console.log("Ground State Update", this.player.RotationSpeed.Deg.toFixed(4), this.player.Transform.Rotation.Deg.toFixed(4));
    }

    protected shiftyUpdate(deltaTime: number): void {
        const shiftyTargetAngle = this.player.ShiftyInput.Value * PLAYER_CONFIG.shiftyMaxAngle;
        this.player.ShiftyAngle = ExtraMath.lerpSafe(
            this.player.ShiftyAngle, 
            shiftyTargetAngle, 
            PLAYER_CONFIG.shiftyLerpSpeed * deltaTime
        );
        
        this.body.Transform.Rotation = (this.player.ShiftyAngle * -1) + ExtraMath.degToRad(90); // Flip for goofy
    }

    protected physicsUpdate(deltaTime: number): void {
        // Apply gravity
        this.player.Velocity = this.player.Velocity.add(new Vector2D(
            0,
            PLAYER_CONFIG.gravityStrength * deltaTime
        )) 

        // Rotate
        this.player.RotationSpeed = this.player.RotationInput.Value * ExtraMath.degToRad(PLAYER_CONFIG.rotationSpeed);
        
        // Normal force
        const forward = Vector2D.fromAngle(this.board.Transform.WorldRotation - Math.PI / 2);
        const direction = this.player.Velocity.normalize();
        const projected = direction.projectOnto(forward);
        const normal = projected.subtract(direction);

        const strength = Math.pow((1 - normal.magnitude()), 2) * 0.25 + 1;
        const normalDirection = projected.subtract(direction).normalize().multiply(strength);

        this.player.Velocity = this.player.Velocity.add(normalDirection.multiply(deltaTime * PLAYER_CONFIG.slipStrength));

        // Friction
        this.player.Velocity = this.player.Velocity.multiply(1 - PLAYER_CONFIG.frictionStrength * deltaTime);

        this.player.Transform.Rotation += this.player.RotationSpeed * deltaTime;

        // Update position
        this.player.Transform.Position = this.player.Transform.Position.add(this.player.Velocity.multiply(deltaTime))
    }

    public override get StateName(): StateName {
        return "ground";
    }

    // #endregion
}