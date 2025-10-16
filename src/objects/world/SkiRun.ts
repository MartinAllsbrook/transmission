import { BezierSpline, GameObject, Vector2D, LayerManager } from "framework";
import { Graphics } from "pixi.js";

export class SkiRun extends GameObject {
    private spline: BezierSpline;
    private width: number;
    private resolution: number;
    private points: Vector2D[] = [];
    private directions: Vector2D[] = [];

    constructor(parent: GameObject, spline: BezierSpline, width: number = 350, resolution: number = 20) {
        super(parent);

        this.spline = spline;
        this.width = width;
        this.resolution = resolution;
        this.points = spline.getPoints(resolution);
        this.directions = spline.getDirections(resolution);
    }

    protected override createOwnSprites(): Promise<void> {
        const rightPoints: Vector2D[] = [];
        const leftPoints: Vector2D[] = [];

        for (let i = 0; i < this.points.length; i++) {
            const point = this.points[i];
            const direction = this.directions[i];
            const right = direction.perpendicular().normalize().multiply(this.width / 2);
            const left = right.multiply(-1);

            rightPoints.push(point.add(right));
            leftPoints.push(point.add(left));
        }
        


        // Create center fill
        this.createStroke(0.5, "#f0f5f9", this.width); // Greenish fill for ski run

        // Create border lines
        this.createStroke(0, "#efeff6", 32); // Right border
        this.createStroke(1, "#efeff6", 32); // Left border
        
        LayerManager.getLayer("background").attach(this.container);
        return super.createOwnSprites();
    }

    private createStroke(offset: number, color: string, width: number){
        const strokePoints: Vector2D[] = [];
        for (let i = 0; i < this.points.length; i++) {
            const point = this.points[i];
            const direction = this.directions[i];
            const right = direction.perpendicular().normalize().multiply((this.width / 2));
            const left = right.multiply(-1);

            const rightPoint = point.add(right);
            const leftPoint = point.add(left);

            const strokePoint = Vector2D.lerp(leftPoint, rightPoint, offset);
            strokePoints.push(strokePoint);
        }

        const strokeGraphics = new Graphics();
        strokeGraphics.moveTo(strokePoints[0].x, strokePoints[0].y);
        for (let i = 1; i < strokePoints.length; i++) {
            strokeGraphics.lineTo(strokePoints[i].x, strokePoints[i].y);
        }

        strokeGraphics.stroke({width: width, color: color, miterLimit: 1, join: "round"});
        this.container.addChild(strokeGraphics);

    }
}