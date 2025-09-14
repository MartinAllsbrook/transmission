import { ExtraMath } from "../../math/ExtraMath.ts";
import { Vector2D } from "../../math/Vector2D.ts";
import { GameObject } from "../GameObject.ts";
import { Snowboarder } from "./Snowboarder.ts";

export class Head extends GameObject {
    private snowboarder: Snowboarder;
    private targetRotation: number = 0;
    private lerpSpeed: number = 6; // Adjust this to control how fast the head turns
    private maxHeadTurn: number = 145; // Maximum degrees the head can turn from center

    constructor(parent: Snowboarder) {
        super(parent);
        this.snowboarder = parent;
        this.container.label = "Head";
    }

    public override update(deltaTime: number): void {
        const forward = this.snowboarder.Velocity.normalize();
        const velocityAngle = forward.heading() * (180 / Math.PI);
        
        let relativeTargetRotation = velocityAngle - this.snowboarder.WorldRotation; // Calculate the desired head rotation relative to the snowboarder
        relativeTargetRotation = this.normalizeAngle(relativeTargetRotation); // Normalize the angle to be between -180 and 180
        
        const clampedTarget = Math.max(-this.maxHeadTurn, Math.min(this.maxHeadTurn, relativeTargetRotation)); // Clamp the target rotation to the allowed range
        
        // If the target is outside our range, we need to handle wrapping
        if (Math.abs(relativeTargetRotation) > this.maxHeadTurn) {
            // Check if wrapping to the other side would be closer to the target
            const wrappedTarget = relativeTargetRotation > 0 ? 
                relativeTargetRotation - 360 : 
                relativeTargetRotation + 360;
            
            const wrappedClampedTarget = Math.max(-this.maxHeadTurn, Math.min(this.maxHeadTurn, wrappedTarget));
            
            // Use the wrapped target if it's closer to our current rotation
            const currentDistance = Math.abs(this.rotation - clampedTarget);
            const wrappedDistance = Math.abs(this.rotation - wrappedClampedTarget);
            
            this.targetRotation = wrappedDistance < currentDistance ? wrappedClampedTarget : clampedTarget;
        } else {
            this.targetRotation = clampedTarget;
        }
        
        // Lerp towards the target rotation.
        this.rotation = ExtraMath.lerpSafe(this.rotation, this.targetRotation, this.lerpSpeed * deltaTime);
        
        super.update(deltaTime);
    }

    private normalizeAngle(angle: number): number {
        while (angle > 180) angle -= 360;
        while (angle < -180) angle += 360;
        return angle;
    }

    public override async createSprite() {
        await this.loadSprite("/snowboarder/Head.png", 1);

        await super.createSprite();
    }
}