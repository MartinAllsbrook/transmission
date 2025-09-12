import { SATCollider } from "./SATCollider.ts";

export type CollisionLayer = "default" | "player" | "obstacle" | "feature";

export const LAYERS: CollisionLayer[] = [
    "default",
    "player",
    "obstacle",
    "feature",
];

// Developer-defined collision matrix. Columns correspond to LAYERS by index.
const collisionMatrix: boolean[][] = [
    //  Default     Player      Obstacle    Feature
    [false], // Default
    [false, false], // Player
    [false, true, false], // Obstacle
    [false, true, false, false], // Feature
];

export class CollisionManager {
    static colliders: SATCollider[] = [];

    static addCollider(collider: SATCollider) {
        this.colliders.push(collider);
    }

    static removeCollider(collider: SATCollider) {
        const index = this.colliders.indexOf(collider);
        if (index > -1) {
            this.colliders.splice(index, 1);
        }
    }

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

    static checkCollisions() {
        for (const collider of this.colliders) {
            if (collider.debugging) {
                collider.updateDebugShape();
            }
        }

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
                    colliderA.onCollision(colliderB);
                    colliderB.onCollision(colliderA);
                }
            }
        }
    }
}
