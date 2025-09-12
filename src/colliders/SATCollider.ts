import { GameObject } from "src/objects/GameObject.ts";
import {
    CollisionLayer,
    CollisionManager,
} from "src/colliders/CollisionManager.ts";
import { Vector2D } from "src/math/Vector2D.ts";
import { Graphics } from "pixi.js";

export interface Range {
    min: number;
    max: number;
}

export abstract class SATCollider {
    /** The center of the collider relative to it's parent gameobject */
    protected relativePosition: Vector2D;

    /** The gameobject this collider is attached to */
    protected host: GameObject;

    /** Weather to draw the debugging shape of this collider */
    debugging: boolean;

    /** Named collision layer for filter-based checks */
    public readonly layer: CollisionLayer;

    protected debugShape: Graphics | null = null;

    constructor(
        host: GameObject,
        relativePosition: Vector2D,
        debugging: boolean = false,
        layer: CollisionLayer = "default",
    ) {
        this.relativePosition = relativePosition;
        this.host = host;
        this.debugging = debugging;
        this.layer = layer;

        host.addCollider(this);

        CollisionManager.addCollider(this);
    }

    /**
     * Draws the debugging shape of the collider and adds it to the host gameobject
     */
    protected abstract createDebugShape(): void;

    /**
     * Updates the debugging shape's position based on the host gameobject's position
     */
    public abstract updateDebugShape(): void;

    /**
     * Gets the positions of the vertices of the collider
     */
    protected abstract getVertices(): Vector2D[];

    /**
     * Returns the axes to test for collision
     * @param otherPosition - The position of the other collider (useful for circles)
     * @return - An array of axes (as Points) to test against
     */
    protected abstract getAxes(otherVertexs: Vector2D[]): Vector2D[];

    /**
     * Projects this collider onto the given axis and returns the min and max values
     * @param axis - The axis to project onto
     * @return - The min and max values of the projection
     */
    protected abstract projectOnAxis(axis: Vector2D): Range;

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

    /** The world position of the collider */
    get Position(): Vector2D {
        return this.relativePosition.add(this.host.WorldPosition);
    }

    public onCollision(other: SATCollider): void {
        console.log("Collision detected between", this, "and", other);
    }

    destroy(): void {
        CollisionManager.removeCollider(this);
        if (this.debugShape) {
            this.debugShape.destroy();
            this.debugShape = null;
        }
    }
}
