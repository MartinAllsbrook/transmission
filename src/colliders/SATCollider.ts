import { GameObject } from "src/objects/GameObject.ts";
import { CollisionManager } from "src/colliders/CollisionManager.ts";
import { Vector2D } from "src/math/Vector2D.ts";

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

    constructor(
        host: GameObject,
        relativePosition: Vector2D,
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

    // Currently unused function
    private static projectVertices(axis: Vector2D, vertices: Vector2D[]): Range {
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

    /** The world position of the collider */
    get Position(): Vector2D {
        return this.relativePosition.add(this.host.Position);
    }

    public onCollision(other: SATCollider): void {
        console.log("Collision detected between", this, "and", other);
    }
}
