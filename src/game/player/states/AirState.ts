import { ExtraMath } from "framework";
import { PLAYER_CONFIG } from "../PlayerConfig.ts";
import { PlayerState, StateName } from "./PlayerState.ts";
import { GroundState } from "./GroundState.ts";

export class AirState extends PlayerState {
    public override get StateName(): StateName {
        return "air";
    }

    public override enter(): void {
        this.switchToAirShifty();

        this.trickManager.enterAir(
            Date.now(),
            this.board.Transform.WorldRotation,
            this.player.Velocity.heading(),
        );
    }

    private switchToAirShifty() {
        this.player.Transform.Rotation = this.body.Transform.WorldRotation -
            ExtraMath.degToRad(90); // Flip for goofy
        this.board.Transform.Rotation = this.player.ShiftyAngle;
        this.body.Transform.Rotation = 0 + ExtraMath.degToRad(90); // Flip for goofy
    }

    //#region Update

    public override update(deltaTime: number): void {
        this.shiftyUpdate(deltaTime);
        this.physicsUpdate(deltaTime);

        this.checkGrounded();
    }

    private shiftyUpdate(deltaTime: number): void {
        const shiftyTargetAngle = this.player.ShiftyInput.Value *
            ExtraMath.degToRad(PLAYER_CONFIG.shiftyMaxAngle);
        this.player.ShiftyAngle = ExtraMath.lerpSafe(
            this.player.ShiftyAngle,
            shiftyTargetAngle,
            PLAYER_CONFIG.shiftyLerpSpeed * deltaTime,
        );

        this.board.Transform.Rotation = this.player.ShiftyAngle;
    }

    private physicsUpdate(deltaTime: number): void {
        this.player.DeltaHeight -= PLAYER_CONFIG.deltaDeltaHeight * deltaTime;
        this.player.Height += this.player.DeltaHeight * deltaTime;

        if (this.player.Height < 0 && this.player.DeltaHeight < 0) {
            this.player.Height = 0;
            this.player.DeltaHeight = 0;
        }

        this.player.Transform.Rotation += this.player.RotationSpeed * deltaTime;

        // Update position
        this.player.Transform.Position = this.player.Transform.Position
            .add(this.player.Velocity.multiply(deltaTime));
    }

    //#endregion

    //#region Transitions

    private checkGrounded(): void {
        if (this.player.Height <= 0 && this.player.DeltaHeight <= 0) {
            this.player.Height = 0;
            this.player.DeltaHeight = 0;

            this.player.changeState(new GroundState(this.player));
        }
    }

    //#endregion
}
