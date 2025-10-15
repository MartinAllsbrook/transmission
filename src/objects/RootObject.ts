import { GameObject, Parent } from "./GameObject.ts";
import { Vector2D } from "../math/Vector2D.ts";

export class RootObject extends GameObject {
    public static offset: Vector2D = new Vector2D(
        globalThis.innerWidth / 2,
        globalThis.innerHeight / 2.618,
    );

    constructor(parent: Parent) {
        super(
            parent,
            new Vector2D(globalThis.innerWidth / 2, globalThis.innerHeight / 2.618),
        );

        // new Snow(this);

        this.AutoCenter = false;
    }

    // /**
    //  * ### Debugging use only
    //  * Adds a visual element directly to the offset container
    //  * @param visual - The visual element to add
    //  */
    // public addVisual(visual: Container) {
    //     this.container.addChild(visual);
    // }

    public override get WorldPosition(): Vector2D {
        return new Vector2D(0, 0);
    }
}
