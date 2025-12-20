import { SATCollider } from "./SATCollider.ts";

export type CollisionLayer =
    | "default"
    | "player"
    | "obstacle"
    | "jump"
    | "rail";

export const LAYERS: CollisionLayer[] = [
    "default",
    "player",
    "obstacle",
    "jump",
    "rail",
];

// Columns correspond to LAYERS by index.
const collisionMatrix: boolean[][] = [
    // Default Player Obstacle Jump
    [false], // Default
    [false, false], // Player
    [false, true, false], // Obstacle
    [false, true, false, false], // Jump
    [false, true, false, false, false], // Rails
];

export class CollisionManager {
    private static debugging: boolean = true;
    private static colliders: SATCollider[] = [];

    public static addCollider(collider: SATCollider) {
        this.colliders.push(collider);
    }

    public static removeCollider(collider: SATCollider) {
        const index = this.colliders.indexOf(collider);
        if (index > -1) {
            this.colliders.splice(index, 1);
        }
    }

    /**
     * Determines if two collision layers should check for collisions based on the collision matrix
     * @returns - Whether the two layers should check for collisions
     */
    private static shouldLayersCollide(
        layerA: CollisionLayer,
        layerB: CollisionLayer,
    ): boolean {
        const iA = LAYERS.indexOf(layerA);
        const iB = LAYERS.indexOf(layerB);
        if (iA < 0 || iB < 0) return false;

        const aRow = collisionMatrix[iA];
        const bRow = collisionMatrix[iB];

        // Get whether each layer collides with the other, defaulting to false if out of bounds
        const aToB = aRow[iB] !== undefined ? aRow[iB] : false;
        const bToA = bRow[iA] !== undefined ? bRow[iA] : false;

        return aToB || bToA;
    }

    public static update() {
        if (this.debugging) {
            this.updateDebugShapes();
        }

        this.checkCollisions();
    }

    private static checkCollisions() {
        for (let i = 0; i < this.colliders.length; i++) {
            for (let j = i + 1; j < this.colliders.length; j++) {
                const colliderA = this.colliders[i];
                const colliderB = this.colliders[j];
                if (
                    colliderA !== colliderB &&
                    this.shouldLayersCollide(
                        colliderA.layer,
                        colliderB.layer,
                    ) &&
                    colliderA.checkCollision(colliderB)
                ) {
                    colliderA.colliding(colliderB);
                    colliderB.colliding(colliderA);
                } else {
                    colliderA.notColliding(colliderB);
                    colliderB.notColliding(colliderA);
                }
            }
        }
    }

    //#region Debugging

    private static updateDebugShapes() {
        for (const collider of this.colliders) {
            collider.updateDebugShape();
        }
    }

    private static createDebugShapes() {
        for (const collider of this.colliders) {
            collider.createDebugShape();
        }
    }

    private static removeDebugShapes() {
        for (const collider of this.colliders) {
            collider.removeDebugShape();
        }
    }

    public static set Debugging(value: boolean) {
        if (this.debugging === value) return;

        if (value) {
            this.createDebugShapes();
        } else {
            this.removeDebugShapes();
        }

        this.debugging = value;
    }

    public static get Debugging(): boolean {
        return this.debugging;
    }

    //#endregion
}
