import { Angle } from "./math/Angle.ts";
import { Vector2D } from "./math/Vector2D.ts";

export interface TransformOptions {
    position?: Vector2D;
    rotation?: Angle;
    scale?: Vector2D;
}

export class Transform {
    private parent?: Transform;

    private position: Vector2D;
    private rotation: Angle;
    private scale: Vector2D;

    constructor(parent?: Transform, options?: TransformOptions) {
        this.parent = parent;

        this.position = options?.position || new Vector2D(0, 0);
        this.rotation = options?.rotation || new Angle(0);
        this.scale = options?.scale || new Vector2D(1, 1);
    }

    setParent(parent: Transform) { 
        this.parent = parent;
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

    public get Rotation(): Angle {
        return this.rotation;
    }

    public set Rotation(value: Angle) {
        this.rotation.set(value);
    }

    public get WorldRotation(): Angle {
        if (this.parent) {
            return new Angle(this.parent.WorldRotation.Rad + this.rotation.Rad);
        } else {
            return this.rotation;
        }
    }

    public set WorldRotation(value: Angle) {
        if (this.parent) {
            this.rotation = new Angle(value.Rad - this.parent.WorldRotation.Rad);
        } else {
            this.rotation.set(value);
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