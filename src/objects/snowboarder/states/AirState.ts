import { State } from "./State.ts";

export class AirState extends State {
    public override enter(): void {
        this.switchToAirShifty();
        this.tricksManager.trickStart(
            this.snowboarder.BoardWorldRotation, 
            this.snowboarder.Velocity.heading() * 180 / Math.PI
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
        super.update(deltaTime);

        this.tricksManager.trickUpdate(
            deltaTime,
            this.snowboarder.BoardRotation, 
            this.snowboarder.Velocity.heading() * 180 / Math.PI
        );
    }

    protected override shiftyUpdate(deltaTime: number): void {
        this.snowboarder.ShiftyTargetAngle = this.snowboarder.ShiftyInput * -this.snowboarder.MaxShiftyAngle;
        this.shiftyAngle = ExtraMath.lerpSafe(this.shiftyAngle, this.snowboarder.ShiftyTargetAngle, this.shiftyLerpSpeed * deltaTime);
        this.snowboard.Rotation = this.shiftyAngle;
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