import { GameRoot, UIElement, UIText, Vector2D } from "framework";
import { Graphics } from "pixi.js";

export class DebugStats extends UIElement {
    public override get Name() { return "DebugStats"; }

    constructor(
        parent: UIElement | GameRoot,
        root: GameRoot
    ) {
        super(parent, root, {
            size: new Vector2D(200, 100)
        });
    }

    protected override start(): void {

    }

    // private fpsText: UIText;
    // private positionText: UIText;
    // private rotationText: UIText;
}