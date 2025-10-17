import { GameObject } from "./GameObject.ts";
import { Transform } from "./Transform.ts";

export class Camera {
    private parent?: GameObject;

    private transform: Transform;

    constructor(parent?: GameObject) {
        this.parent = parent;
        this.transform = new Transform(parent ? parent.Transform : undefined);
    }

    public get Transform(): Transform {
        return this.transform;
    }
}