import { Vector2D } from "../Vector2D.ts";

export class SplinePoint {
    private position: Vector2D;
    private handle: Vector2D;

    constructor(position: Vector2D, handle: Vector2D = new Vector2D(0, 128)) {
        this.position = position;
        this.handle = handle;
    }

    public get Position(): Vector2D {
        return this.position;
    }

    public get HandleIn(): Vector2D {
        return this.position.add(this.handle.negate());
    }

    public get HandleOut(): Vector2D {
        return this.position.add(this.handle);
    }
}
