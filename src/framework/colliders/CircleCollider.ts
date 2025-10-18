// import { Graphics } from "pixi.js";
import { Range, SATCollider } from "./SATCollider.ts";
import { GameObject } from "../GameObject.ts";
import { Vector2D } from "../math/Vector2D.ts";
import { CollisionLayer } from "./CollisionManager.ts";
import { Graphics } from "pixi.js";
// import Game from "../../islands/Game.tsx";

export class CircleCollider extends SATCollider {
    /** The radius of the collider */
    radius: number;

    constructor(
        host: GameObject,
        layer: CollisionLayer = "default",
        radius: number,
        position: Vector2D,
    ) {
        super(host, layer, position);

        this.radius = radius;

        // if (this.debugging) {
        //     this.createDebugShape();
        // }
    }

    public createDebugShape(): void {
        this.debugShape = new Graphics()
            .circle(0, 0, this.radius)
            .stroke({ width: 1, color: 0x00ff00, alpha: 0.5 });

        this.debugShape.label = "CircleCollider Debug Shape";
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
        }
    }

    protected getVertices(): Vector2D[] {
        // Circles don't have vertices, but we can return the center as a single "vertex"
        return [this.WorldPosition];
    }

    protected getAxes(otherVertexs: Vector2D[]): Vector2D[] {
        const axes: Vector2D[] = [];

        for (const vertex of otherVertexs) {
            // The axis is the vector from this circle's center to the other circle's center
            const axis = this.WorldPosition.subtract(vertex).normalize();

            axes.push(axis);
        }
        return axes;
    }

    protected projectOnAxis(axis: Vector2D): Range {
        // Project the center of the circle onto the axis
        const centerProjection = this.WorldPosition.dot(axis);
        return {
            min: centerProjection - this.radius,
            max: centerProjection + this.radius,
        };
    }
}
