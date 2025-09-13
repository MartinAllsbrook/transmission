import { Vector2D } from "src/math/Vector2D.ts";
import { GameObject } from "src/objects/GameObject.ts";
import { Container, Graphics } from "pixi.js";

interface TrailSegment {
    position: Vector2D;
    direction: Vector2D;
    graphics: Container;
}

interface TrailPoint {
    position: Vector2D;
    direction: Vector2D;
}

export class SnowboarderTrail extends GameObject {
    public static instance: SnowboarderTrail | null = null;

    private trailSegments: TrailSegment[] = [];

    private priviousTrailPoint: TrailPoint | null = null;

    public maxPoints: number = 250;

    constructor(parent: GameObject) {
        super(parent);

        SnowboarderTrail.instance = this;
        this.container.label = "SnowboarderTrail";
    }

    public addTrailPoint(position: Vector2D, direction: Vector2D) {
        if (this.priviousTrailPoint) {
            const distance = position.distanceTo(
                this.priviousTrailPoint.position,
            );

            const segmentSpacing = 5; // Distance between trail segments

            if (distance > segmentSpacing) {
                // Calculate how many segments we need to place
                const numSegments = Math.floor(distance / segmentSpacing);

                // Interpolate between the previous point and current point
                for (let i = 1; i <= numSegments; i++) {
                    const t = i / Math.ceil(distance / segmentSpacing);
                    const interpolatedPosition = Vector2D.lerp(
                        this.priviousTrailPoint.position,
                        position,
                        t,
                    );
                    const interpolatedDirection = Vector2D.lerp(
                        this.priviousTrailPoint.direction,
                        direction,
                        t,
                    ).normalize(); // Normalize to maintain unit direction

                    this.addTrailSegment(
                        interpolatedPosition,
                        interpolatedDirection,
                    );
                }
                // Add the final segment at the exact current position
                this.addTrailSegment(position, direction);
            } else {
                // If distance is small, just add the current segment
                this.addTrailSegment(position, direction);
            }

            // Always update the previous trail point to the current position
            this.priviousTrailPoint = {
                position: position.clone(),
                direction: direction.clone(),
            };
        } else {
            // First trail point
            this.addTrailSegment(position, direction);
            this.priviousTrailPoint = {
                position: position.clone(),
                direction: direction.clone(),
            };
        }
    }

    private addTrailSegment(position: Vector2D, direction: Vector2D) {
        const length = 20; // Define the capsule length
        const width = 6; // Define the capsule width (diameter)
        const graphics = new Graphics();

        // Draw rectangle (centered at position, aligned with direction)
        graphics.rect(-length / 2, -width / 2, length, width);
        // Draw left circle
        graphics.circle(-length / 2, 0, width / 2);
        // Draw right circle
        graphics.circle(length / 2, 0, width / 2);
        // Draw capsule: two circles at ends, connected by a rectangle
        graphics.fill({ color: 0xdddddd, alpha: 1 });

        // Align the capsule with the direction vector
        const angle = Math.atan2(direction.y, direction.x);
        graphics.rotation = angle;
        graphics.position.set(position.x, position.y);

        // Add to trailPoints
        this.trailSegments.push({
            position,
            direction,
            graphics,
        });

        // Optionally remove oldest if exceeding maxPoints
        if (this.trailSegments.length > this.maxPoints) {
            const old = this.trailSegments.shift();
            old?.graphics.destroy();
        }

        // Add to display list
        this.container.addChild(graphics);
    }
}
