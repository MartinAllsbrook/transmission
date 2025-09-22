import { BezierSpline } from "../../math/splines/BezierSpline.ts";
import { GameObject } from "../GameObject.ts";
import { Vector2D } from "../../math/Vector2D.ts";
import { Graphics } from "pixi.js";
import { LayerManager } from "../../rendering/LayerManager.ts";

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
        
        // Create border lines
        const rightGraphics = new Graphics();
        rightGraphics.moveTo(rightPoints[0].x, rightPoints[0].y);
        for (let i = 1; i < rightPoints.length; i++) {
            rightGraphics.lineTo(rightPoints[i].x, rightPoints[i].y);
        }
        rightGraphics.stroke({width: 16, color: "#eeeeee", miterLimit: 1, join: "round"});

        const leftGraphics = new Graphics();
        leftGraphics.moveTo(leftPoints[0].x, leftPoints[0].y);
        for (let i = 1; i < leftPoints.length; i++) {
            leftGraphics.lineTo(leftPoints[i].x, leftPoints[i].y);
        }
        leftGraphics.stroke({width: 16, color: "#eeeeee", miterLimit: 1, join: "round"});

        LayerManager.getLayer("background").attach(this.container);
        this.container.addChild(rightGraphics);
        this.container.addChild(leftGraphics);

        // Create grooming stripes
        const numStripes = 96; // Number of grooming stripes across the run
        const groomColor = "#e6f0fa"; // Very light blue-grey for grooming effect
        const groomWidth = 2; // Thinner lines for grooming

        for (let stripe = 1; stripe < numStripes; stripe++) {
            const t = stripe / numStripes; // Interpolation factor (0.167, 0.333, 0.5, 0.667, 0.833)
            const stripePoints: Vector2D[] = [];

            // Calculate points for this stripe by lerping between left and right
            for (let i = 0; i < leftPoints.length; i++) {
                const leftPoint = leftPoints[i];
                const rightPoint = rightPoints[i];
                const stripePoint = Vector2D.lerp(leftPoint, rightPoint, t);
                stripePoints.push(stripePoint);
            }

            // Draw the stripe
            const stripeGraphics = new Graphics();
            stripeGraphics.moveTo(stripePoints[0].x, stripePoints[0].y);
            for (let i = 1; i < stripePoints.length; i++) {
                stripeGraphics.lineTo(stripePoints[i].x, stripePoints[i].y);
            }
            stripeGraphics.stroke({width: groomWidth, color: groomColor, miterLimit: 1});

            this.container.addChild(stripeGraphics);
        }

        return super.createOwnSprites();
    }
}