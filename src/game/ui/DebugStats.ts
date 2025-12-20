import { BitmapUIText, GameRoot, UIElement, Vector2D } from "framework";
import { Graphics } from "pixi.js";

export class DebugStats extends UIElement {
    public override get Name() { return "DebugStats"; }

    public static instance: DebugStats;

    private positionText: BitmapUIText;
    private velocityText: BitmapUIText;
    private rotationText: BitmapUIText;
    private heightText: BitmapUIText;

    constructor(
        parent: UIElement | GameRoot,
        root: GameRoot
    ) {
        super(parent, root, {
            size: new Vector2D(200, 56),
            position: new Vector2D(10, 10)
        });

        DebugStats.instance = this;

        // Debug box
        const background = new Graphics();

        background.rect(
            this.uiTransform.LocalTopLeft.X, 
            this.uiTransform.LocalTopLeft.Y,
            this.uiTransform.Size.X,
            this.uiTransform.Size.Y
        );

        background.stroke({ color: 0x000000, width: 1 });
        background.fill({ color: 0xffffff });

        this.addGraphics(background);

        this.positionText = new BitmapUIText(this, this.root, {}, {
            size: new Vector2D(200, 14),
            position: new Vector2D(0, 0)
        });
        this.velocityText = new BitmapUIText(this, this.root, {}, {
            size: new Vector2D(200, 14),
            position: new Vector2D(0, 14)
        });
        this.rotationText = new BitmapUIText(this, this.root, {}, {
            size: new Vector2D(200, 14),
            position: new Vector2D(0, 28)
        });
        this.heightText = new BitmapUIText(this, this.root, {}, {
            size: new Vector2D(200, 14),
            position: new Vector2D(0, 42)
        });
    }

    public updateStat(statName: "position" | "velocity" | "rotation" | "height", value: string): void {
        switch (statName) {
            case "position":
                this.positionText.updateText(`Position: ${value}`);
                break;
            case "velocity":
                this.velocityText.updateText(`Velocity: ${value}`);
                break;
            case "rotation":
                this.rotationText.updateText(`Rotation: ${value}`);
                break;
            case "height":
                this.heightText.updateText(`Height: ${value}`);
                break;
        }
    }

    protected override start(): void {
        this.positionText.updateText("Position: (0, 0)");
        this.velocityText.updateText("Velocity: (0, 0)");
        this.rotationText.updateText("Rotation: 0°");
        this.heightText.updateText("Height: 0");
    }
}