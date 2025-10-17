import { Vector2D } from "./math/Vector2D.ts";

interface TransformDefaults {
    position?: Vector2D;
    rotation?: number;
    scale?: Vector2D;
}

export class Transform {
    parent?: Transform;

    position: Vector2D;
    rotation: number;
    scale: Vector2D;

    constructor(parent?: Transform, defaults?: TransformDefaults) {
        this.parent = parent;

        this.position = defaults?.position || new Vector2D(0, 0);
        this.rotation = defaults?.rotation || 0;
        this.scale = defaults?.scale || new Vector2D(1, 1);
    }

    //#region Position
    
    public get Position(): Vector2D {
        return this.position.clone();
    }

    public set Position(value: Vector2D) {
        this.position.set(value);
    }

    public get WorldPosition(): Vector2D {
        if (this.parent) {
            return this.parent.WorldPosition.add(this.position);
        } else {
            return this.Position;
        }
    }

    public set WorldPosition(value: Vector2D) {
        if (this.parent) {
            this.position = value.subtract(this.parent.WorldPosition);
        } else {
            this.position = value.clone();
        }
    }

    //#endregion

    //#region Rotation

    public get Rotation(): number {
        return this.rotation;
    }

    public set Rotation(value: number) {
        this.rotation = value;
    }

    public get WorldRotation(): number {
        if (this.parent) {
            return this.parent.WorldRotation + this.rotation;
        } else {
            return this.rotation;
        }
    }

    public set WorldRotation(value: number) {
        if (this.parent) {
            this.rotation = value - this.parent.WorldRotation;
        } else {
            this.rotation = value;
        }
    }

    //#endregion

    //#region Scale

    public get Scale(): Vector2D {
        return this.scale.clone();
    }

    public set Scale(value: Vector2D) {
        this.scale.set(value);
    }

    public get WorldScale(): Vector2D {
        if (this.parent) {
            return new Vector2D(
                this.parent.WorldScale.x * this.scale.x,
                this.parent.WorldScale.y * this.scale.y
            );
        } else {
            return this.Scale;
        }
    }

    public set WorldScale(value: Vector2D) {
        if (this.parent) {
            this.scale = new Vector2D(
                value.x / this.parent.WorldScale.x,
                value.y / this.parent.WorldScale.y
            );
        } else {
            this.scale = value.clone();
        }
    }

    //#endregion
}