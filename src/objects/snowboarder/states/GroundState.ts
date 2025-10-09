import { ExtraMath } from "../../../math/ExtraMath.ts";
import { Vector2D } from "../../../math/Vector2D.ts";
import { PlayerState, SharedStateData, SnowboarderInfo } from "./PlayerState.ts";

export class GroundState extends PlayerState {
    private shiftyAngle: number;
    private shiftyTargetAngle: number;
    private rotationRate: number;

    constructor(snowboarderInfo: SnowboarderInfo, sharedStateData: SharedStateData) {
        super(snowboarderInfo, sharedStateData);

        this.shiftyAngle = sharedStateData?.shiftyAngle ?? 0;
        this.shiftyTargetAngle = sharedStateData?.shiftyTargetAngle ?? 0;
        this.rotationRate = sharedStateData?.rotationRate ?? 0;
    }
    
    public override enter(): void {
        this.switchToGroundShifty();
        this.tricksManager.endSpin(
            this.board.WorldRotation, 
            this.player.Velocity.heading() * 180 / Math.PI
        );
    }

    private switchToGroundShifty() {
        this.shiftyAngle = this.shiftyAngle * -1;
        this.player.Rotation = this.board.WorldRotation;
        this.body.Rotation = this.shiftyAngle + 90; // Flip for goofy
        this.board.Rotation = 0; 
    }

    public override shiftyUpdate(deltaTime: number): void {
        this.shiftyTargetAngle = this.inputs.shifty * this.config.shiftyMaxAngle;
        this.shiftyAngle = ExtraMath.lerpSafe(this.shiftyAngle, this.shiftyTargetAngle, this.config.shiftyLerpSpeed * deltaTime);
        this.body.Rotation = this.shiftyAngle + 90; // Flip for goofy
    }

    public override physicsUpdate(deltaTime: number): void {
        // Apply gravity
        this.player.Velocity = new Vector2D(
            this.player.Velocity.x,
            this.player.Velocity.y + this.config.gravityStrength * deltaTime,
        )

        // Rotate
        this.rotationRate += (this.inputs.turn - this.rotationRate) * deltaTime * 10;
        
        const radians = (this.board.WorldRotation) * (Math.PI / 180);

        // Normal force
        const forward = Vector2D.fromAngle(radians - Math.PI / 2);
        const direction = this.player.Velocity.normalize();
        const projected = direction.projectOnto(forward);
        const normal = projected.subtract(direction);

        const strength = Math.pow((1 - normal.magnitude()), 2) * 0.25 + 1;
        const normalDirection = projected.subtract(direction).normalize().multiply(strength);

        this.player.Velocity = this.player.Velocity.add(normalDirection.multiply(deltaTime * this.config.slipStrength));

        // Friction
        this.player.Velocity = this.player.Velocity.multiply(
            1 - this.config.frictionStrength * deltaTime,
        );
    }

    protected override getSharedStateData(): SharedStateData {
        return {
            shiftyAngle: this.shiftyAngle,
            shiftyTargetAngle: this.shiftyTargetAngle,
            rotationRate: this.rotationRate
        };
    }
}