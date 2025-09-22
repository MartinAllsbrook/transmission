import { BezierSpline } from "../../math/splines/BezierSpline.ts";
import { GameObject } from "../GameObject.ts";
import { Vector2D } from "../../math/Vector2D.ts";
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
        
        const rightGraphics = new Graphics();
        rightGraphics.moveTo(rightPoints[0].x, rightPoints[0].y);
        for (let i = 1; i < rightPoints.length; i++) {
            rightGraphics.lineTo(rightPoints[i].x, rightPoints[i].y);
        }
        rightGraphics.stroke({width: 16, color: "#eeeeee"}); // Red line, 2px width


        const leftGraphics = new Graphics();
        leftGraphics.moveTo(leftPoints[0].x, leftPoints[0].y);
        for (let i = 1; i < leftPoints.length; i++) {
            leftGraphics.lineTo(leftPoints[i].x, leftPoints[i].y);
        }
        leftGraphics.stroke({width: 16, color: "#eeeeee"}); // Blue line, 2px width

        this.container.addChild(rightGraphics);
        this.container.addChild(leftGraphics);

        return super.createOwnSprites();
    }
}