import { Range, SATCollider } from "./SATCollider.ts";
import { CollisionLayer } from "./CollisionManager.ts";
import { GameObject } from "../GameObject.ts";
import { Vector2D } from "../math/Vector2D.ts";
import { Graphics } from "pixi.js";
import { Angle } from "../math/Angle.ts";

export interface RectColliderOptions {
    layer?: CollisionLayer;
    size?: Vector2D;
    position?: Vector2D;
    /** Rotation is not currently used */
    rotation?: Angle;
}

/**
 * Simple collider class that uses SAT for square collision detection - May expand in the future
 */
export class RectCollider extends SATCollider {
    /** The size of the collider */
    size: Vector2D;

    rotation: Angle = Angle.Zero;

    constructor(
        host: GameObject,
        opitions: RectColliderOptions = {}
    ) {
        super(host, opitions.layer, opitions.position);

        this.size = opitions.size ?? new Vector2D(50, 50);
        this.rotation = opitions.rotation ?? Angle.Zero;
    }

    public override createDebugShape(): void {
        this.debugShape = new Graphics()
            .rect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y)
            .stroke({ width: 1, color: 0x00ff00, alpha: 0.5 });

        this.debugShape.label = "RectCollider Debug Shape";
        this.host.Root.addContainer(this.debugShape);

        this.updateDebugShape();
    }

    public override updateDebugShape(): void {
        super.updateDebugShape();

        if (this.debugShape) {
            this.debugShape.position.set(
                this.WorldPosition.x,
                this.WorldPosition.y,
            );
            this.debugShape.rotation = this.host.Transform.WorldRotation.Rad;
        }
    }

    protected getVertices(): Vector2D[] {
        const halfWidth = this.size.x / 2;
        const halfHeight = this.size.y / 2;
        const rotation = this.host.Transform.WorldRotation.Rad;

        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        return [
            new Vector2D(
                this.WorldPosition.x + -halfWidth * cos - -halfHeight * sin,
                this.WorldPosition.y + -halfWidth * sin + -halfHeight * cos,
            ),
            new Vector2D(
                this.WorldPosition.x + halfWidth * cos - -halfHeight * sin,
                this.WorldPosition.y + halfWidth * sin + -halfHeight * cos,
            ),
            new Vector2D(
                this.WorldPosition.x + halfWidth * cos - halfHeight * sin,
                this.WorldPosition.y + halfWidth * sin + halfHeight * cos,
            ),
            new Vector2D(
                this.WorldPosition.x + -halfWidth * cos - halfHeight * sin,
                this.WorldPosition.y + -halfWidth * sin + halfHeight * cos,
            ),
        ];
    }

    protected getAxes(_otherVertexes: Vector2D[]): Vector2D[] {
        const vertices = this.getVertices();

        const axes = [];
        for (let i = 0; i < vertices.length; i++) {
            const p1 = vertices[i];
            const p2 = vertices[(i + 1) % vertices.length]; // Mod to wrap around to the first vertex
            const edge = p2.subtract(p1);
            const normal = new Vector2D(-edge.y, edge.x).normalize();
            axes.push(normal);
        }
        return axes;
    }

    protected override projectOnAxis(axis: Vector2D): Range {
        const vertices = this.getVertices();
        // Initialize max and min
        let min = axis.dot(vertices[0]);
        let max = min;

        for (let i = 1; i < vertices.length; i++) {
            const projection = axis.dot(vertices[i]);
            if (projection < min) {
                min = projection;
            }
            if (projection > max) {
                max = projection;
            }
        }

        return { min, max };
    }
}
