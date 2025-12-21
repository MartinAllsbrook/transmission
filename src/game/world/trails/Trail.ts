import { CatmullRomSpline, ExtraMath, GameObject, Vector2D } from "framework";
import { Graphics } from "pixi.js";

export class Trail extends GameObject {
    public override get Name() {
        return "Trail";
    }

    private debugGraphics: Graphics | null = null;

    private spline: CatmullRomSpline = new CatmullRomSpline([
        new Vector2D(0, -1024),
        new Vector2D(0, -512),
        new Vector2D(0, 0),
        new Vector2D(0, 512),
    ], 150);

    protected override start(): void {
        // Initialize a few points after the starting points
        for (let i = 0; i < 4; i++) {
            const nextPoint = this.generateNextPoint(this.getLastSplinePoint());
            this.spline.addControlPoint(nextPoint);
        }

        this.updateTrail();
    }

    protected override reset(): void {
        this.spline = new CatmullRomSpline([
            new Vector2D(0, -1024),
            new Vector2D(0, -512),
            new Vector2D(0, 0),
            new Vector2D(0, 512),
        ], 150);

        // Initialize a few points after the starting points
        for (let i = 0; i < 4; i++) {
            const nextPoint = this.generateNextPoint(this.getLastSplinePoint());
            this.spline.addControlPoint(nextPoint);
        }

        this.updateTrail();
    }

    /**
     * Returns the distance from a given position to the trail.
     * @param position - The position to measure from.
     * @returns - The distance to the trail.
     */
    public getDistanceToTrail(position: Vector2D): number {
        const closest = this.spline.getClosestPoint(position);
        return closest ? position.distanceTo(closest.point) : Infinity;
    }

    public getClosestPoint(
        position: Vector2D,
    ): { point: Vector2D; t: number } | null {
        return this.spline.getClosestPoint(position);
    }

    private generateNextPoint(lastPoint: Vector2D): Vector2D {
        // Average distance will be 0.5 * variation + minDistance
        const variation = 512;
        const minDistance = 256;

        const distance = ExtraMath.normalRandom() * variation + minDistance;

        // Map normal distribution (0-1) to angle range (0-180 degrees)
        // 0.5 maps to 90 degrees (straight down), extremes map to left/right
        const normalValue = ExtraMath.normalRandom();
        const angleInDegrees = normalValue * 180; // 0 to 180 degrees
        const angleInRadians = (angleInDegrees * Math.PI) / 180;

        // Create direction vector from angle
        // 0° = right (+x), 90° = down (+y), 180° = left (-x)
        const direction = new Vector2D(
            Math.cos(angleInRadians),
            Math.sin(angleInRadians),
        );

        // Scale by distance and add to last point
        const offset = direction.multiply(distance);
        return lastPoint.add(offset);
    }

    /**
     * Extends the trail by adding a new point to the end of the spline.
     */
    public extendTrail() {
        // Add a new point to the end of the spline
        const newPoint = this.generateNextPoint(this.getLastSplinePoint());
        this.spline.addControlPoint(newPoint);
        this.updateTrail();
    }

    /**
     * Removes the oldest point in the trail.
     */
    public shortenTrail() {
        // Remove the oldest point in the spline
        this.spline.shiftPoint();
        this.updateTrail();
    }

    /**
     * Returns the second to last (highest) point in the trail.
     * This is the third point in the spline because the first is used for tangents, and the second is to far lol.
     * @returns The last point in the trail
     * ### TODO: this is really second to last point, rename
     */
    public getLastPoint(): Vector2D {
        const point = this.spline.getControlPoint(2);

        if (!point) throw new Error("Not enough control points in spline");

        return point;
    }

    /**
     * Returns the first (lowest) point in the trail.
     * This is the second-to-last point in the spline because the last one is used for tangents.
     * @returns The first point in the trail
     */
    public getFirstPoint(): Vector2D {
        const point = this.spline.getControlPoint(
            this.spline.controlPointCount() - 2,
        );

        if (!point) throw new Error("Not enough control points in spline");

        return point;
    }

    /**
     * @returns The last control point in the spline. This is not the last point in the trail.
     */
    private getLastSplinePoint(): Vector2D {
        const point = this.spline.getControlPoint(
            this.spline.controlPointCount() - 1,
        );

        if (!point) throw new Error("Not enough control points in spline");

        return point;
    }

    /**
     * This method doesn't do anything yet LMAO
     */
    private updateTrail() {
        if (this.debugGraphics) {
            this.debugGraphics.destroy();
        }

        const splinePoints = this.spline.getCachedSamplePoints();

        if (!splinePoints) {
            return;
        }

        const graphics = new Graphics();

        graphics.moveTo(splinePoints[0].x, splinePoints[0].y);
        for (const point of splinePoints) {
            graphics.lineTo(point.x, point.y);
        }

        graphics.stroke({
            width: 10,
            color: 0x00ff00,
        });

        this.debugGraphics = graphics;
        this.addGraphics(graphics);
    }
}
