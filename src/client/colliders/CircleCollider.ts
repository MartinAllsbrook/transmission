import { Graphics, Point } from "pixi.js";
import { Range, SATCollider } from "./SATCollider.ts";
import { GameObject } from "../objects/GameObject.ts";

export class CircleCollider extends SATCollider {
    /** The radius of the collider */
    radius: number;

    constructor(
        host: GameObject,
        position: Point,
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

    protected getVertices(): Point[] {
        // Circles don't have vertices, but we can return the center as a single "vertex"
        return [this.Position];
    }

    protected getAxes(otherVertexs: Point[]): Point[] {
        const axes: Point[] = [];

        for (const vertex of otherVertexs) {
            // The axis is the vector from this circle's center to the other circle's center
            const axis = SATCollider.normalizePoint(
                SATCollider.subtractPoints(this.Position, vertex)
            );

            axes.push(axis);
        }
        return axes;
    }

    protected projectOnAxis(axis: Point): Range {
        // Project the center of the circle onto the axis
        const centerProjection = SATCollider.dotProduct(this.Position, axis);
        return {
            min: centerProjection - this.radius,
            max: centerProjection + this.radius,
        };
    }
}
