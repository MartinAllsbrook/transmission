import { Graphics } from "pixi.js";
import { Range, SATCollider } from "./SATCollider.ts";
import { GameObject } from "../framework/GameObject.ts";
import { Vector2D } from "src/math/Vector2D.ts";
import { CollisionLayer } from "./CollisionManager.ts";
import Game from "../../islands/Game.tsx";

export class CircleCollider extends SATCollider {
    /** The radius of the collider */
    radius: number;

    constructor(
        host: GameObject,
        position: Vector2D,
        radius: number,
        debugging: boolean = false,
        layer: CollisionLayer = "default",
    ) {
        super(host, position, debugging, layer);

        this.radius = radius;

        if (this.debugging) {
            this.createDebugShape();
        }
    }

    protected createDebugShape(): void {
        this.debugShape = new Graphics()
            .circle(0, 0, this.radius)
            .stroke({ width: 1, color: 0x00ff00, alpha: 0.5 });

        Game.app?.stage.addChild(this.debugShape);

        this.updateDebugShape();
    }

    public override updateDebugShape(): void {
        if (this.debugShape) {
            this.debugShape.position.set(
                this.Position.x,
                this.Position.y,
            );
        }
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
