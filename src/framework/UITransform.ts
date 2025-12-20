import { Vector2D } from "./math/Vector2D.ts";
import { Transform, TransformOptions } from "./Transform.ts";

export interface UITransformOptions extends TransformOptions{
    pivot?: Vector2D;
    anchor?: Vector2D;
    size?: Vector2D;
}

export class UITransform extends Transform {
    public override get isUI(): boolean { return true; }

    /** The 0, 0 point of this element */
    protected pivot: Vector2D;
    
    /** Where in the parent element this element should attach */
    protected anchor: Vector2D;

    /** The size of this element */
    protected size: Vector2D;

    constructor(parent?: Transform, options?: UITransformOptions) {
        super(parent, options);

        this.pivot = options?.pivot || new Vector2D(0, 0);
        this.anchor = options?.anchor || new Vector2D(0, 0);
        this.size = options?.size || new Vector2D(128, 128);
    }

    public override get WorldPosition(): Vector2D {
        if (this.parent?.isUI) {
            const parent = this.parent as UITransform;
            return new Vector2D(
                parent.TopLeft.x + this.anchor.x * parent.Size.x + this.position.x,
                parent.TopLeft.y + this.anchor.y * parent.Size.y + this.position.y
            );
        } else if (this.parent) {
            return super.WorldPosition;
        } else {
            const screenDimensions = new Vector2D(globalThis.innerWidth, globalThis.innerHeight);

            return new Vector2D(
                screenDimensions.x * this.anchor.x + this.position.x,
                screenDimensions.y * this.anchor.y + this.position.y
            );
        }
    }

    public override set WorldPosition(value: Vector2D) {
        if (this.parent?.isUI) {
            const parent = this.parent as UITransform;
            this.position = new Vector2D(
                value.x - parent.TopLeft.x - this.anchor.x * parent.Size.x,
                value.y - parent.TopLeft.y - this.anchor.y * parent.Size.y
            );
        } else if (this.parent) {
            super.WorldPosition = value;
        } else {
            const screenDimensions = new Vector2D(globalThis.innerWidth, globalThis.innerHeight);

            this.position = new Vector2D(
                value.x - screenDimensions.x * this.anchor.x,
                value.y - screenDimensions.y * this.anchor.y
            );
        }
    }

    public get LocalTopLeft(): Vector2D {
        return new Vector2D(
            -this.size.x * this.pivot.x,
            -this.size.y * this.pivot.y
        );
    }

    public get TopLeft(): Vector2D {
        return new Vector2D(
            this.WorldPosition.x - this.size.x * this.pivot.x,
            this.WorldPosition.y - this.size.y * this.pivot.y
        );
    }

    public get Pivot(): Vector2D {
        return this.pivot.clone();
    }

    public set Pivot(value: Vector2D) {
        this.pivot.set(value);
    }

    public get Anchor(): Vector2D {
        return this.anchor.clone();
    }

    public set Anchor(value: Vector2D) {
        this.anchor.set(value);
    }

    public get Size(): Vector2D {
        return this.size.clone();
    }

    public set Size(value: Vector2D) {
        this.size.set(value);
    }
}