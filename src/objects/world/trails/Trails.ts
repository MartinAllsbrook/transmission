import { CatmullRomSpline } from "../../../math/splines/CatmullRomSpline.ts";
import { Vector2D } from "../../../math/Vector2D.ts";
import { GameObject } from "../../GameObject.ts";
import { ExtraMath } from "../../../math/ExtraMath.ts";
import { World } from "../World.ts";
import { Graphics } from "pixi.js";

export class Trails extends GameObject {
    private spline: CatmullRomSpline;
    private world: World;
    // private debugGraphics: Graphics;

    constructor(parent: World, startingPoint: Vector2D = new Vector2D(128, 128), width: number = 10, resolution: number = 10) {
        super(parent);

        const initialPoints: Vector2D[] = [];

        this.world = parent;

        // To start we need to initialize 2 points before the starting point
        initialPoints.push(new Vector2D(startingPoint.x, startingPoint.y - 512));
        initialPoints.push(new Vector2D(startingPoint.x, startingPoint.y - 512));
        initialPoints.push(startingPoint);

        // Then we should initialize a few points after the starting point
        for (let i = 0; i < 5; i++) {
            initialPoints.push(this.nextPoint(initialPoints[initialPoints.length - 1]));
        }

        // This gives us 8 points to start with. 
        // The path does not render anything involving the first or last two.
        // Right this would render 3, 4, 5, and 6

        // Create the spline
        this.spline = new CatmullRomSpline(initialPoints);
        // this.debugGraphics = this.spline.drawDebug(this.world);
    }

    private nextPoint(lastPoint: Vector2D): Vector2D {
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
        const direction = new Vector2D(Math.cos(angleInRadians), Math.sin(angleInRadians));
        
        // Scale by distance and add to last point
        const offset = direction.multiply(distance);
        return lastPoint.add(offset);
    }

    public getDistanceToTrail(position: Vector2D): number {
        const closest = this.spline.getClosestPoint(position, 20);
        return closest ? position.distanceTo(closest.point) : Infinity;
    }

    private updateTrail() {
        // this.debugGraphics.destroy(); // TODO: delete or make this use clear()
        // this.debugGraphics = this.spline.drawDebug(this.world);
    }

    /**
     * Extends the trail by adding a new point to the end of the spline. 
     */
    public extendTrail() {
        // Add a new point to the end of the spline
        const newPoint = this.nextPoint(this.getLastSplinePoint());
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
     * Returns the seccond to last (higest) point in the trail. 
     * This is the third point in the spline because the first is used for tangents, and the seccond is to far lol.
     * @returns The last point in the trail
     * ### TODO: this is really seccond to last point, rename
     */
    public getLastPoint(): Vector2D { 
        const point = this.spline.getControlPoint(2);

        if (!point) throw new Error("Not enough control points in spline");

        return point;
    }

    /**
     * Returns the first (lowest) point in the trail.
     * This is the seccond-to-last point in the spline because the last one is used for tangents.
     * @returns The first point in the trail
     */
    public getFirstPoint(): Vector2D {
        const point = this.spline.getControlPoint(this.spline.controlPointCount() - 2);

        if (!point) throw new Error("Not enough control points in spline");

        return point;
    }

    /**
     * @returns The last control point in the spline. This is not the last point in the trail.
     */
    private getLastSplinePoint(): Vector2D {
        const point = this.spline.getControlPoint(this.spline.controlPointCount() - 1);

        if (!point) throw new Error("Not enough control points in spline");

        return point;
    }

    public override destroy(): void {
        // this.debugGraphics.destroy();
        super.destroy();
    }
}