import { Sprite } from "pixi.js";
import { GameObject, Parent, CircleCollider, Vector2D } from "framework";
import { World } from "./World.ts";
import { RootObject } from "../RootObject.ts";

export class Obstacle extends GameObject {
    private leafSprites: Sprite[] = [];
    private baseScale: number = 1.25;
    private world: World;

    private showingWarning: boolean = false;
    private warningSprite?: Sprite;

    private stumpSize = 8;

    constructor(parent: Parent, position: Vector2D, world: World) {
        super(parent, position);

        this.world = world;
    }

    protected override async createOwnSprites(): Promise<void> {
        const trunkSprite = await this.loadSprite("/obsticales/tree/Trunk.png");
        trunkSprite.anchor.set(0.5, 1);
        trunkSprite.scale.set(this.baseScale, this.baseScale);

        const numLeaves = 5;
        for (let i = 1; i <= numLeaves; i++) {
            const leafSprite = await this.loadSprite(`/obsticales/tree/LeavesLayer.png`);
            leafSprite.anchor.set(0.5, 1);
            leafSprite.position.y = i * -16;
            const scale = ((numLeaves - i) * 0.25 + 1) * this.baseScale;
            leafSprite.scale.set(scale, scale);
            this.leafSprites.push(leafSprite);
        }

        new CircleCollider(
            this,
            new Vector2D(0, -this.stumpSize),
            this.stumpSize,
            true,
            "obstacle",
        );

        this.warningSprite = await this.loadSprite("/Warning.png", { 
            position: new Vector2D(0, -this.stumpSize),
            layer: "ui",
            scale: new Vector2D(1.5, 1.5),
        });

        this.warningSprite.visible = false;

        // LayerManager.getLayer("foreground")?.attach(this.container);
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

        const showDistance = 256;
        const distance = this.ScreenPosition.subtract(RootObject.offset).magnitude()
        if (distance <= showDistance) {
            if (!this.showingWarning) {
                this.showingWarning = true;
            }
            
            if (this.warningSprite) {
                this.warningSprite.visible = true;
                this.warningSprite.alpha = 1 - distance / showDistance; 
            }
        } else {
            if (this.showingWarning) {
                this.showingWarning = false;
                if (this.warningSprite) {
                    this.warningSprite.visible = false;
                }
            }
        }    


        super.update(_deltaTime);
    }
}
