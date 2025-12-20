import { GameObject } from "./GameObject.ts";

export class Component {
    protected parent: GameObject;

    constructor(parent: GameObject) {
        this.parent = parent;
    }
}
