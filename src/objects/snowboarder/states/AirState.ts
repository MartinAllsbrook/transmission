import { ExtraMath } from "../../../math/ExtraMath.ts";
import { PlayerState, SharedStateData, SnowboarderInfo } from "./PlayerState.ts";

export class AirState extends PlayerState {
    private shiftyAngle: number = 0;
    private shiftyTargetAngle: number = 0;
    private deltaHeight: number = 0;
    private height: number = 0;

    constructor(snowboarderInfo: SnowboarderInfo, sharedStateData: SharedStateData) {
        super(snowboarderInfo, sharedStateData);
     
        this.shiftyAngle = sharedStateData?.shiftyAngle ?? 0;
        this.shiftyTargetAngle = sharedStateData?.shiftyTargetAngle ?? 0;
        this.deltaHeight = sharedStateData?.deltaHeight ?? 0;
        this.height = sharedStateData?.height ?? 0;
    }

    public override enter(): void {
        this.switchToAirShifty();
        this.tricksManager.trickStart(
            this.board.WorldRotation, 
            this.player.Velocity.heading() * 180 / Math.PI
        );
    }

    private switchToAirShifty() {
        this.shiftyAngle = this.shiftyAngle * -1;

        console.log(this.board.WorldRotation)

        this.player.Rotation = this.body.WorldRotation - 90; // Flip for goofy
        this.board.Rotation = this.shiftyAngle;
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
        this.shiftyTargetAngle = this.inputs.shifty * -this.config.shiftyMaxAngle;
        this.shiftyAngle = ExtraMath.lerpSafe(this.shiftyAngle, this.shiftyTargetAngle, this.config.shiftyLerpSpeed * deltaTime);
        this.board.Rotation = this.shiftyAngle;
    }

    protected override physicsUpdate(deltaTime: number): void {
        this.deltaHeight -= 16  * deltaTime;
        this.height += this.deltaHeight * deltaTime;

        if (this.height <= 0) {
            this.height = 0;
            this.deltaHeight = 0;
            this.player.InAir = false; // This will trigger the player to exit the air state
        }
    }

    protected override getSharedStateData(): SharedStateData {
        return {
            shiftyAngle: this.shiftyAngle,
            shiftyTargetAngle: this.shiftyTargetAngle,
            deltaHeight: this.deltaHeight,
            height: this.height
        };
    }
}