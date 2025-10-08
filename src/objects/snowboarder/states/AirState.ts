import { ExtraMath } from "../../../math/ExtraMath.ts";
import { State } from "./State.ts";

export class AirState extends State {
    public override enter(): void {
        const player = this.snowboarder;

        this.switchToAirShifty();
        this.tricksManager.trickStart(
            player.BoardWorldRotation, 
            player.Velocity.heading() * 180 / Math.PI
        );
    }

    private switchToAirShifty() {
        const player = this.snowboarder;

        player.ShiftyAngle = player.ShiftyAngle * -1;
        player.Rotation = player.BoardWorldRotation - 90; // Flip for goofy
        player.BoardRotation = player.ShiftyAngle;
        player.BodyRotation = 0 + 90; // Flip for goofy
    }

    public override update(deltaTime: number): void {
        const player = this.snowboarder;

        super.update(deltaTime);

        this.tricksManager.trickUpdate(
            deltaTime,
            player.BoardRotation, 
            player.Velocity.heading() * 180 / Math.PI
        );
    }

    protected override shiftyUpdate(deltaTime: number): void {
        const player = this.snowboarder;

        player.ShiftyTargetAngle = player.ShiftyInput * -player.MaxShiftyAngle;
        player.ShiftyAngle = ExtraMath.lerpSafe(player.ShiftyAngle, player.ShiftyTargetAngle, player.ShiftyLerpSpeed * deltaTime);
        player.Rotation = player.ShiftyAngle;
    }

    protected override physicsUpdate(deltaTime: number): void {
        this.vericalVelocity -= 16  * deltaTime;
        this.height += this.vericalVelocity * deltaTime;

        if (this.height <= 0) {
            this.height = 0;
            this.vericalVelocity = 0;
            this.InAir = false;
        }
    }

    public override exit(): void {

    }
}