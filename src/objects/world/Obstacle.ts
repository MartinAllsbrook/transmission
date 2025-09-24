import { Assets, Sprite } from "pixi.js";
import { GameObject, Parent } from "src/objects/GameObject.ts";
import { CircleCollider } from "src/colliders/CircleCollider.ts";
import { Vector2D } from "src/math/Vector2D.ts";
import { LayerManager } from "../../rendering/LayerManager.ts";

export class Obstacle extends GameObject {
    private leafSprites: Sprite[] = [];
    private baseScale: number = 1.25;

    constructor(
        parent: Parent,
        position: Vector2D,
    ) {
        super(parent, position);
    }

    protected override async createOwnSprites(): Promise<void> {

        const trunkSprite = await this.loadSprite("/obsticales/tree/Trunk.png", 1);
        trunkSprite.anchor.set(0.5, 1);
        trunkSprite.scale.set(this.baseScale, this.baseScale);

        const numLeaves = 5;
        for (let i = 1; i <= numLeaves; i++) {
            const leafSprite = await this.loadSprite(`/obsticales/tree/LeavesLayer.png`, 1);
            leafSprite.anchor.set(0.5, 1);
            leafSprite.position.y = i * -16;
            const scale = ((numLeaves - i) * 0.25 + 1) * this.baseScale;
            leafSprite.scale.set(scale, scale);
            this.leafSprites.push(leafSprite);
        }

        const _collider = new CircleCollider(
            this,
            new Vector2D(0, -3),
            6,
            true,
            "obstacle",
        );

        LayerManager.getLayer("foreground")?.attach(this.container);
    }

    public override update(_deltaTime: number): void {
        this.leafSprites.forEach((leaf, index) => {
            // Sway effect
            const angle = (Date.now() / 1000) + (index * 0.5);
            const swayAmount = 0.05; // Adjust the sway amount as needed
            leaf.rotation = Math.sin(angle) * swayAmount;
        
            // Paralax effect
            const parallaxAmount = -0.005; // Adjust the parallax amount as needed
            const baseSpacing = -16 * this.baseScale; // Base spacing between leaves
            leaf.position.y = ((globalThis.innerHeight - this.ScreenPosition.y) * parallaxAmount + baseSpacing) * (index +0.5 ) ;
        });
    }
}
