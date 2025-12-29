import { ExtraMath, GameObject, GameRoot, TransformOptions } from "framework";
import { Player } from "./Player.ts";
import { Body } from "./Body.ts";

export class Head extends GameObject {
    public override get Name() {
        return "Head";
    }
    public override get layer(): string {
        return "player3";
    }

    private body: Body;
    private player: Player;

    private targetRotation: number = 0;
    private lerpSpeed: number = 6; // Adjust this to control how fast the head turns
    private maxHeadTurn: number = ExtraMath.degToRad(145); // Maximum degrees the head can turn from center

    constructor(
        parent: Body,
        player: Player,
        root: GameRoot,
        transformOptions?: TransformOptions,
    ) {
        super(parent, root, transformOptions);

        this.body = parent;
        this.player = player;
    }

    protected override start(): void {
        this.loadSprite("snowboarder/Head.png");
    }

    public override update(deltaTime: number): void {
        const forward = this.player.Velocity.normalize();
        const velocityAngle = forward.heading();

        let relativeTargetRotation = velocityAngle - this.body.Transform.WorldRotation; // Calculate the desired head rotation relative to the snowboarder
        relativeTargetRotation = this.normalizeAngle(relativeTargetRotation); // Normalize the angle to be between -180 and 180

        const clampedTarget = Math.max(
            -this.maxHeadTurn,
            Math.min(this.maxHeadTurn, relativeTargetRotation),
        ); // Clamp the target rotation to the allowed range

        // If the target is outside our range, we need to handle wrapping
        if (Math.abs(relativeTargetRotation) > this.maxHeadTurn) {
            // Check if wrapping to the other side would be closer to the target
            const wrappedTarget = relativeTargetRotation > 0
                ? relativeTargetRotation - 360
                : relativeTargetRotation + 360;

            const wrappedClampedTarget = Math.max(
                -this.maxHeadTurn,
                Math.min(this.maxHeadTurn, wrappedTarget),
            );

            // Use the wrapped target if it's closer to our current rotation
            const currentDistance = Math.abs(this.Transform.Rotation - clampedTarget);
            const wrappedDistance = Math.abs(
                this.Transform.Rotation - wrappedClampedTarget,
            );

            this.targetRotation = wrappedDistance < currentDistance
                ? wrappedClampedTarget
                : clampedTarget;
        } else {
            this.targetRotation = clampedTarget;
        }

        // Lerp towards the target rotation.
        this.Transform.Rotation = ExtraMath.lerpSafe(
            this.Transform.Rotation,
            this.targetRotation,
            this.lerpSpeed * deltaTime,
        );

        super.update(deltaTime);
    }

    private normalizeAngle(angle: number): number {
        while (angle > 180) angle -= 360;
        while (angle < -180) angle += 360;
        return angle;
    }
}
