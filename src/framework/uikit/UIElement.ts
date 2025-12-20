import { GameObject, GameRoot, Transform, TransformOptions } from "framework";
import { Graphics } from "pixi.js";
import { UITransform, UITransformOptions } from "../UITransform.ts";

export abstract class UIElement extends GameObject {
    public override get layer() {
        return "ui";
    }
    public override get isUI() {
        return true;
    }

    protected uiTransform: UITransform;

    constructor(
        parent: GameObject | GameRoot,
        root: GameRoot,
        transformOptions?: UITransformOptions,
    ) {
        super(parent, root, transformOptions);

        this.uiTransform = this.Transform as UITransform;
    }

    protected override createTransform(options: TransformOptions): Transform {
        const transform = new UITransform(
            this.parent.Transform,
            options as UITransformOptions,
        );
        return transform;
    }

    // public override get Transform(): UITransform {
    //     return this.uiTransform;
    // }
}
