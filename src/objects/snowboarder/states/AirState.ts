import { ExtraMath } from "../../../math/ExtraMath.ts";
import { State } from "./State.ts";

export class AirState extends State {
    public override enter(): void {
        this.switchToAirShifty();
        this.tricksManager.trickStart(
            this.snowboarder.BoardWorldRotation, 
            this.data.velocity.heading() * 180 / Math.PI
        );
    }

    private switchToAirShifty() {
        this.data.shiftyAngle = this.data.shiftyAngle * -1;
        this.snowboarder.Rotation = this.snowboarder.BoardWorldRotation - 90; // Flip for goofy
        this.snowboarder.BoardRotation = this.data.shiftyAngle;
        this.snowboarder.BodyRotation = 0 + 90; // Flip for goofy
    }

    public override update(deltaTime: number): void {
        super.update(deltaTime);

        this.tricksManager.trickUpdate(
            deltaTime,
            this.snowboarder.BoardRotation, 
            this.data.velocity.heading() * 180 / Math.PI
        );
    }

    protected override shiftyUpdate(deltaTime: number): void {
        this.data.shiftyTargetAngle = this.input.shifty * -this.settings.maxShiftyAngle;
        this.data.shiftyAngle = ExtraMath.lerpSafe(this.data.shiftyAngle, this.data.shiftyTargetAngle, this.settings.shiftyLerpSpeed * deltaTime);
        this.snowboarder.Rotation = this.data.shiftyAngle;
    }

    protected override physicsUpdate(deltaTime: number): void {
        const player = this.snowboarder;

        this.data.verticalVelocity -= 16  * deltaTime;
        this.data.height += this.data.verticalVelocity * deltaTime;

        if (this.data.height <= 0) {
            this.data.height = 0;
            this.data.verticalVelocity = 0;
            player.InAir = false; // This will trigger the player to exit the air state
        }
    }

    public override exit(): void {

    }
}