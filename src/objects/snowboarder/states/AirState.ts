import { ExtraMath } from "../../../math/ExtraMath.ts";
import { PlayerState } from "./PlayerState.ts";

export class AirState extends PlayerState {
    public override enter(): void {
        this.switchToAirShifty();
        this.tricksManager.trickStart(
            this.board.WorldRotation, 
            this.player.Velocity.heading() * 180 / Math.PI
        );
    }

    private switchToAirShifty() {
        this.player.ShiftyAngle = this.player.ShiftyAngle * -1;

        console.log(this.board.WorldRotation)

        this.player.Rotation = this.body.WorldRotation - 90; // Flip for goofy
        this.board.Rotation = this.player.ShiftyAngle;
        this.body.Rotation = 0 + 90; // Flip for goofy
    }

    public override update(deltaTime: number): void {
        super.update(deltaTime);

        this.tricksManager.trickUpdate(
            deltaTime,
            this.board.Rotation, 
            this.player.Velocity.heading() * 180 / Math.PI
        );
    }

    protected override shiftyUpdate(deltaTime: number): void {
        this.player.ShiftyTargetAngle = this.inputs.shifty * -this.config.shiftyMaxAngle;
        this.player.ShiftyAngle = ExtraMath.lerpSafe(this.player.ShiftyAngle, this.player.ShiftyTargetAngle, this.config.shiftyLerpSpeed * deltaTime);
        this.board.Rotation = this.player.ShiftyAngle;
    }

    protected override physicsUpdate(deltaTime: number): void {
        this.player.VerticalVelocity -= 16  * deltaTime;
        this.player.Height += this.player.VerticalVelocity * deltaTime;

        if (this.player.Height <= 0) {
            this.player.Height = 0;
            this.player.VerticalVelocity = 0;
            this.player.InAir = false; // This will trigger the player to exit the air state
        }
    }

    public override exit(): void {

    }
}