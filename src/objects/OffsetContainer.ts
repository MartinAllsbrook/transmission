import { GameObject, Parent } from "./GameObject.ts";
import { Vector2D } from "../math/Vector2D.ts";

export class OffsetContainer extends GameObject {
    constructor(parent: Parent) {
        super(
            parent,
            new Vector2D(globalThis.innerWidth / 2, globalThis.innerHeight / 2),
            new Vector2D(0, 0),
        );
    }
}
