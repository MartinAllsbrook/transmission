import { PlayerState, StateName } from "./PlayerState.ts";

export class AirState extends PlayerState {
    public override get StateName(): StateName {
        return "air";
    }

    public override enter(): void {
        this.switchToAirShifty();
    }

    private switchToAirShifty() {
        this.player.Transform.Rotation = this.body.Transform.WorldRotation - 90; // Flip for goofy
        this.board.Transform.Rotation = this.player.ShiftyAngle;
        this.body.Transform.Rotation = 0 + 90; // Flip for goofy
    }
}