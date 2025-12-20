import { GameObject, GameRoot, Vector2D } from "framework";
import { TrickFeedbackText } from "../ui/tricks/TrickFeedbackText.ts";

export class TrickManager extends GameObject{
    public override get Name() { return "TrickManager"; }

    // private testText: TrickFeedbackText = new TrickFeedbackText(this, this.root, "Test Trick!");

    constructor(
        parent: GameObject,
        root: GameRoot,
    ) {
        super(parent, root);
    }

    protected override update(_deltaTime: number): void {
        this.Transform.WorldRotation = 0;
        this.Transform.WorldScale = new Vector2D(1, 1);
    }

    public trick(text: string): void {
        new TrickFeedbackText(this, this.root, text);
    }
}