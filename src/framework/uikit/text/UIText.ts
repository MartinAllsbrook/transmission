import { GameRoot, UIElement } from "framework";
import { UITransformOptions } from "../../UITransform.ts";

export abstract class UIText extends UIElement {
    constructor(
        parent: UIElement | GameRoot,
        root: GameRoot,
        transformOptions?: UITransformOptions,
    ) {
        super(parent, root, transformOptions);


    }
    
}