import { GameObject, GameRoot, TransformOptions, Vector2D } from "framework";
import { Graphics } from "pixi.js";

export abstract class UIElement extends GameObject {
    public override get layer() { return "ui"; }
    public override get isUI() { return true; }

    protected position: Vector2D = new Vector2D(0, 0);
    protected size: Vector2D = new Vector2D(100, 100);

    protected anchor: Vector2D = new Vector2D(-1, -1); // Top-left by default

    constructor(
        parent: GameObject | GameRoot,
        root: GameRoot,
        transformOptions?: TransformOptions
    ) {
        super(parent, root, transformOptions);

        const box = new Graphics();

        box.rect(this.position.x, this.position.y, this.size.x, this.size.y);
        box.stroke({ color: 0xff0000, width: 2 });

        this.addGraphics(box);
    }
}