import { Graphics } from "pixi.js";
import { Range, SATCollider } from "./SATCollider.ts";
import { GameObject } from "../objects/GameObject.ts";
import { Vector2D } from "../math/Vector2D.ts";

/**
 * Simple collider class that uses SAT for square collision detection - May expand in the future
 */
export class RectCollider extends SATCollider {
    /** The size of the collider */
    size: Vector2D;

    /** The roatation of the collider */
    rotation: number;

    constructor(
        host: GameObject,
        position: Vector2D,
        size: Vector2D,
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

    protected getVertices(): Vector2D[] {
        const halfWidth = this.size.x / 2;
        const halfHeight = this.size.y / 2;
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);
        return [
            new Vector2D(
                this.Position.x + -halfWidth * cos - -halfHeight * sin,
                this.Position.y + -halfWidth * sin + -halfHeight * cos,
            ),
            new Vector2D(
                this.Position.x + halfWidth * cos - -halfHeight * sin,
                this.Position.y + halfWidth * sin + -halfHeight * cos,
            ),
            new Vector2D(
                this.Position.x + halfWidth * cos - halfHeight * sin,
                this.Position.y + halfWidth * sin + halfHeight * cos,
            ),
            new Vector2D(
                this.Position.x + -halfWidth * cos - halfHeight * sin,
                this.Position.y + -halfWidth * sin + halfHeight * cos,
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
