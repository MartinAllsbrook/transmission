import { Graphics } from "pixi.js";
import { GameObject, Parent, LayerManager, Vector2D } from "framework";

export class Shadow extends GameObject {
    private radius: number = 20;
    private shinkFactor: number = 0.7;

    constructor(parent: Parent) {
        super(parent);
        this.container.label = "Shadow";

        LayerManager.getLayer("shadows")?.attach(this.container);
    }

    protected override createOwnSprites(): Promise<void> {
        let radius = this.radius;
        for (let i = 0; i < 3; i++) {
            const ellipse = new Graphics()
            .ellipse(0, 0, radius, radius / 2)
            .fill({
                color: "#000000", 
                alpha: 0.15
            })
            this.container.addChild(ellipse);
            radius *= this.shinkFactor;
        }
    
        return super.createOwnSprites(); // Ensure async context
    }

    public setEffects(height: number, rotation: number): void {
        this.Rotation = rotation;

        this.Position = new Vector2D(0, height * 15);

        this.scale = new Vector2D(1 + height * 0.15, 1 + height * 0.15);
        this.container.alpha = Math.max(0, 1 - height * 0.33);
    }
}