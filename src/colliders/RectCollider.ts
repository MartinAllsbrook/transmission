import { Graphics } from "pixi.js";
import { Range, SATCollider } from "./SATCollider.ts";
import { CollisionLayer } from "./CollisionManager.ts";
import { GameObject } from "../objects/GameObject.ts";
import { Vector2D } from "../math/Vector2D.ts";
import Game from "../../islands/Game.tsx";

/**
 * Simple collider class that uses SAT for square collision detection - May expand in the future
 */
export class RectCollider extends SATCollider {
    /** The size of the collider */
    size: Vector2D;


    constructor(
        host: GameObject,
        position: Vector2D,
        size: Vector2D,
        debugging: boolean = false,
        layer: CollisionLayer = "default",
    ) {
        super(host, position, debugging, layer);

        this.size = size;

        if (this.debugging) {
            this.createDebugShape();
        }
    }

    protected createDebugShape(): void {
        this.debugShape = new Graphics()
            .rect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y)
            .stroke({ width: 1, color: 0x00ff00 });

        Game.app?.stage.addChild(this.debugShape);
        if (!Game.app?.stage) console.error("No stage found in Game.app");

        this.updateDebugShape();
    }

    public override updateDebugShape(): void {
        if (this.debugShape) {
            const screenCenter = new Vector2D(
                globalThis.window.innerWidth / 2,
                globalThis.window.innerHeight / 2,
            );
            this.debugShape.position.set(
                this.Position.x + screenCenter.x,
                this.Position.y + screenCenter.y
            );
            this.debugShape.rotation = this.Rotation;
        }
    }

    protected getVertices(): Vector2D[] {
        const halfWidth = this.size.x / 2;
        const halfHeight = this.size.y / 2;
        const cos = Math.cos(this.Rotation);
        const sin = Math.sin(this.Rotation);
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

    protected get Rotation(): number {
        return this.host.rotation * (Math.PI / 180);
    }
}
