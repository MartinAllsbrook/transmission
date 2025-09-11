import { Graphics } from "pixi.js";
import { Range, SATCollider } from "./SATCollider.ts";
import { GameObject } from "src/objects/GameObject.ts";
import { Vector2D } from "src/math/Vector2D.ts";

export class CircleCollider extends SATCollider {
    /** The radius of the collider */
    radius: number;

    constructor(
        host: GameObject,
        position: Vector2D,
        radius: number,
        debugging: boolean = false,
    ) {
        super(host, position, debugging);

        this.radius = radius;

        if (this.debugging) {
            this.drawDebugShape();
        }
    }

    protected drawDebugShape(): void {
        const graphics = new Graphics()
            .circle(
                this.relativePosition.x,
                this.relativePosition.y,
                this.radius,
            )
            .stroke({ width: 1, color: 0x00ff00 });

        this.host.addVisual(graphics);
    }

    protected getVertices(): Vector2D[] {
        // Circles don't have vertices, but we can return the center as a single "vertex"
        return [this.Position];
    }

    protected getAxes(otherVertexs: Vector2D[]): Vector2D[] {
        const axes: Vector2D[] = [];

        for (const vertex of otherVertexs) {
            // The axis is the vector from this circle's center to the other circle's center
            const axis = this.Position.subtract(vertex).normalize();

            axes.push(axis);
        }
        return axes;
    }

    protected projectOnAxis(axis: Vector2D): Range {
        // Project the center of the circle onto the axis
        const centerProjection = this.Position.dot(axis);
        return {
            min: centerProjection - this.radius,
            max: centerProjection + this.radius,
        };
    }
}
