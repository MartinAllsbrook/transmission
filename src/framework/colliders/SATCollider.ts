import { Graphics } from "pixi.js";

import { GameObject } from "../GameObject.ts";
import { CollisionLayer, CollisionManager } from "./CollisionManager.ts";
import { Vector2D } from "../math/Vector2D.ts";

export interface Range {
    min: number;
    max: number;
}

export abstract class SATCollider {
    /** Named collision layer for filter-based checks */
    public readonly layer: CollisionLayer;

    // Hosting
    protected position: Vector2D;
    protected host: GameObject;

    /** Set of colliders this collider is currently colliding with */
    private currentlyColliding: Set<SATCollider> = new Set();

    // Collision event callbacks
    private onEnterCallbacks: ((other: SATCollider) => void)[] = [];
    private onStayCallbacks: ((other: SATCollider) => void)[] = [];
    private onExitCallbacks: ((other: SATCollider) => void)[] = [];

    // Debugging
    protected debugShape: Graphics | null = null;

    constructor(
        host: GameObject,
        layer: CollisionLayer = "default",
        position: Vector2D = new Vector2D(0, 0),
    ) {
        this.position = position;
        this.host = host;
        this.layer = layer;

        this.host.addCollider(this);
        CollisionManager.addCollider(this);
    }

    // #region Abstract Methods

    public abstract createDebugShape(): void;

    public updateDebugShape(): void {
        if (CollisionManager.Debugging && !this.debugShape) {
            this.createDebugShape();
        }
    }

    public removeDebugShape(): void {
        if (this.debugShape) {
            this.debugShape.destroy();
            this.debugShape = null;
        }
    }

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

    // #endregion

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
    get WorldPosition(): Vector2D {
        return this.position.add(this.host.Transform.WorldPosition);
    }

    // #region Event System

    public colliding(other: SATCollider): void {
        if (!this.currentlyColliding.has(other)) {
            this.currentlyColliding.add(other);
            for (const callback of this.onEnterCallbacks) {
                callback(other);
            }
        } else {
            for (const callback of this.onStayCallbacks) {
                callback(other);
            }
        }
    }

    public notColliding(other: SATCollider): void {
        if (this.currentlyColliding.has(other)) {
            this.currentlyColliding.delete(other);
            for (const callback of this.onExitCallbacks) {
                callback(other);
            }
        }
    }

    public onCollisionEnter(callback: (other: SATCollider) => void): void {
        this.onEnterCallbacks.push(callback);
    }

    public onCollisionStay(callback: (other: SATCollider) => void): void {
        this.onStayCallbacks.push(callback);
    }

    public onCollisionExit(callback: (other: SATCollider) => void): void {
        this.onExitCallbacks.push(callback);
    }

    // #endregion

    destroy(): void {
        CollisionManager.removeCollider(this);

        if (this.debugShape) {
            this.debugShape.destroy();
            this.debugShape = null;
        }
    }

    public get Host(): GameObject {
        return this.host;
    }
}
