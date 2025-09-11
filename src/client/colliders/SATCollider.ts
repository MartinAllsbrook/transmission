import { Point } from "pixi.js";
import { GameObject } from "../objects/GameObject.ts";
import { CollisionManager } from "./CollisionManager.ts";

export interface Range {
    min: number;
    max: number;
}

export abstract class SATCollider {
    /** The center of the collider relative to it's parent gameobject */
    protected relativePosition: Point;

    /** The gameobject this collider is attached to */
    protected host: GameObject; 

    /** Weather to draw the debugging shape of this collider */
    debugging: boolean;

    constructor(
        host: GameObject,
        relativePosition: Point,
        debugging: boolean = false,
    ) {
        this.relativePosition = relativePosition;
        this.host = host;
        this.debugging = debugging;

        CollisionManager.addCollider(this);
    }

    /**
     * Draws the debugging shape of the collider and adds it to the host gameobject
     */
    protected abstract drawDebugShape(): void;

    /**
     * Gets the positions of the vertices of the collider
     */
    protected abstract getVertices(): Point[];

    /**
     * Returns the axes to test for collision
     * @param otherPosition - The position of the other collider (useful for circles)
     * @return - An array of axes (as Points) to test against 
     */
    protected abstract getAxes(otherVertexs: Point[]): Point[]; 

    /**
     * Projects this collider onto the given axis and returns the min and max values
     * @param axis - The axis to project onto
     * @return - The min and max values of the projection
     */
    protected abstract projectOnAxis(axis: Point): Range;

    /**
     * Checks if this collider is colliding with another collider using the SAT algorithm
     * @param other - The other collider to check against
     * @returns - True if colliding, false otherwise
     */
    public checkCollision(other: SATCollider): boolean {
        const axesA = this.getAxes(other.getVertices());
        const axesB = other.getAxes(this.getVertices());

        const axes = axesA.concat(axesB);

        for (const axis of axes) {
            const rangeA = this.projectOnAxis(axis);
            const rangeB = other.projectOnAxis(axis);

            // Check for gap
            if (rangeA.max < rangeB.min || rangeB.max < rangeA.min) {
                return false; // Found a separating axis, no collision
            }
        }
     
        return true; // No separating axis found, collision detected
    }

    // Helper methods for Point operations since we can't use @pixi/math-extras in Deno
    protected static normalizePoint(point: Point): Point {
        const length = Math.sqrt(point.x * point.x + point.y * point.y);
        if (length === 0) return new Point(0, 0);
        return new Point(point.x / length, point.y / length);
    }

    protected static dotProduct(a: Point, b: Point): number {
        return a.x * b.x + a.y * b.y;
    }

    protected static addPoints(a: Point, b: Point): Point {
        return new Point(a.x + b.x, a.y + b.y);
    }

    protected static subtractPoints(a: Point, b: Point): Point {
        return new Point(a.x - b.x, a.y - b.y);
    }

    // Currently unused function
    private static projectVertices(axis: Point, vertices: Point[]): Range {
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

    /** The world position of the collider */
    get Position(): Point {

        return SATCollider.addPoints(this.relativePosition, this.host.Position);
    }

    public onCollision(other: SATCollider): void {
        console.log("Collision detected between", this, "and", other);
    }
}
