import { Graphics, Point } from "pixi.js";
import { Range, SATCollider } from "./SATCollider.ts";
import { GameObject } from "../objects/GameObject.ts";

/**
 * Simple collider class that uses SAT for square collision detection - May expand in the future
 */
export class RectCollider extends SATCollider {
    /** The size of the collider */
    size: Point;

    /** The roatation of the collider */
    rotation: number;

    constructor(
        host: GameObject,
        position: Point,
        size: Point,
        rotation: number = 0,
        debugging: boolean = false,
    ) {
        super(host, position, debugging);

        this.rotation = rotation;
        this.size = size;

        if (this.debugging) {
            this.drawDebugShape();
        }
    }

    protected drawDebugShape(): void {
        const halfX = this.size.x / 2;
        const halfY = this.size.y / 2;

        const graphics = new Graphics()
            .rect(0, 0, this.size.x, this.size.y)
            .stroke({ width: 1, color: 0x00ff00 });

        graphics.pivot.x = halfX;
        graphics.pivot.y = halfY;
        graphics.rotation = this.rotation;

        this.host.addVisual(graphics);
    }

    protected getVertices(): Point[] {
        const halfWidth = this.size.x / 2;
        const halfHeight = this.size.y / 2;
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);
        return [
            new Point(
                this.Position.x + -halfWidth * cos - -halfHeight * sin,
                this.Position.y + -halfWidth * sin + -halfHeight * cos,
            ),
            new Point(
                this.Position.x + halfWidth * cos - -halfHeight * sin,
                this.Position.y + halfWidth * sin + -halfHeight * cos,
            ),
            new Point(
                this.Position.x + halfWidth * cos - halfHeight * sin,
                this.Position.y + halfWidth * sin + halfHeight * cos,
            ),
            new Point(
                this.Position.x + -halfWidth * cos - halfHeight * sin,
                this.Position.y + -halfWidth * sin + halfHeight * cos,
            ),
        ];
    }

    protected getAxes(_otherVertexes: Point[]): Point[] {
        const vertices = this.getVertices();

        const axes = [];
        for (let i = 0; i < vertices.length; i++) {
            const p1 = vertices[i];
            const p2 = vertices[(i + 1) % vertices.length]; // Mod to wrap around to the first vertex
            const edge = SATCollider.subtractPoints(p2, p1);
            const normal = SATCollider.normalizePoint(new Point(-edge.y, edge.x));
            axes.push(normal);
        }
        return axes;
    }

    protected override projectOnAxis(axis: Point): Range {
        const vertices = this.getVertices();
        // Initialize max and min
        let min = SATCollider.dotProduct(axis, vertices[0]);
        let max = min;

        for (let i = 1; i < vertices.length; i++) {
            const projection = SATCollider.dotProduct(axis, vertices[i]);
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
