import { Container, Point } from "pixi.js";
import { GameObject } from "./GameObject.ts";

export class World extends GameObject {
    private objects: GameObject[] = [];

    constructor(parent: Container) {
        super(parent, new Point(0, 0));
    }

    update(deltaTime: number): void {
        // Update all child objects
        for (const obj of this.objects) {
            obj.update(deltaTime);
        }
    }
}