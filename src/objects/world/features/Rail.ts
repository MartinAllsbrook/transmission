import { RectCollider } from "../../../colliders/RectCollider.ts";
import { Vector2D } from "../../../math/Vector2D.ts";
import { GameObject } from "../../GameObject.ts";

export class Rail extends GameObject {
    private length: number = 256;
    private wdith: number  = 32;

    private relativeStart: Vector2D = new Vector2D(0, -this.length / 2);
    private relativeEnd: Vector2D = new Vector2D(0, this.length / 2);

    private collider: RectCollider = new RectCollider(this, new Vector2D(0, 0), new Vector2D(this.wdith, this.length), true, "rail");

    constructor(parent: GameObject, position: Vector2D) {
        super(parent, position);
        this.container.label = "Rail";
    }

    private distanceToCenterLine(point: Vector2D): number {
        const localPoint = point.subtract(this.position);

        const startToPoint = localPoint.subtract(this.relativeStart);
        const startToEnd = this.relativeEnd.subtract(this.relativeStart);

        const projection = startToEnd.projectOntoClamped(startToPoint);
        const closestPoint = this.relativeStart.add(projection);
        return localPoint.subtract(closestPoint).magnitude();
    }

    protected override async createOwnSprites(): Promise<void> {
        await this.loadSprite("/features/Tube.png", {
            scale: new Vector2D(2, 4)
        })
        return await super.createOwnSprites();
    }

    public getDirection(): Vector2D {
        return this.relativeEnd.subtract(this.relativeStart).normalize();
    }
}