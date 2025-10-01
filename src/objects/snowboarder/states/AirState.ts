import { State } from "./State.ts";

export class AirState extends State {
    public override enter(): void {
        this.switchToAirShifty();
        this.tricksManager.trickStart(
            this.snowboard.WorldRotation, 
            this.velocity.heading() * 180 / Math.PI
        );
    }

    public override update(deltaTime: number): void {
        super.update(deltaTime);

        this.tricksManager.trickUpdate(
            deltaTime,
            this.snowboard.WorldRotation, 
            this.velocity.heading() * 180 / Math.PI
        );
    }

    public override exit(): void {

    }

    protected override shiftyUpdate(deltaTime: number): void {
        this.shiftyTargetAngle = this.shiftyInput * -this.maxShiftyAngle;
        this.shiftyAngle = ExtraMath.lerpSafe(this.shiftyAngle, this.shiftyTargetAngle, this.shiftyLerpSpeed * deltaTime);
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
}