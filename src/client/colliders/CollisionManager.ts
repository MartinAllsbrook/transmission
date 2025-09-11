import { SATCollider } from "./SATCollider.ts";

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

    static checkCollisions() {
        for (let i = 0; i < this.colliders.length; i++) {
            for (let j = i + 1; j < this.colliders.length; j++) {
                const colliderA = this.colliders[i];
                const colliderB = this.colliders[j];
                if (
                    colliderA !== colliderB &&
                    colliderA.checkCollision(colliderB)
                ) {
                    colliderA.onCollision(colliderB);
                    colliderB.onCollision(colliderA);
                }
            }
        }
    }
}
