import { Vector2D } from "../Vector2D.ts";
// import { Graphics } from "pixi.js";
// import { World } from "../../objects/world/World.ts";

/**
 * A Catmull-Rom spline implementation that provides smooth interpolation through any number of control points.
 * The spline passes through all control points and provides C1 continuity (continuous first derivatives).
 */
export class CatmullRomSplineOld {
    private controlPoints: Vector2D[];
    private tension: number;

    /**
     * Create a new CatmullRomSpline instance
     * @param controlPoints An optional array of Vector2D points to use as initial control points
     * @param tension The tension parameter (0.0 = tight curves, 0.5 = standard Catmull-Rom, 1.0 = loose curves)
     */
    constructor(controlPoints: Vector2D[] = [], tension: number = 0.5) {
        this.controlPoints = [...controlPoints];
        this.tension = Math.max(0, Math.min(1, tension)); // Clamp tension between 0 and 1
    }

    /**
     * Add a control point to the end of the spline
     * @param point The point to add to the spline
     */
    public addControlPoint(point: Vector2D): void {
        this.controlPoints.push(new Vector2D(point.x, point.y));
    }

    /**
     * Remove the last control point from the spline
     * @returns True if a point was removed, false if there were no points
     */
    public popPoint(): boolean {
        if (this.controlPoints.length > 0) {
            this.controlPoints.pop();
            return true;
        }
        return false;
    }

    /**
     * Remove the first control point from the spline
     * @returns True if a point was removed, false if there were no points
     */
    public shiftPoint(): boolean {
        if (this.controlPoints.length > 0) {
            this.controlPoints.shift();
            return true;
        }
        return false;
    }

    /**
     * Insert a control point at the specified index
     * @param point The point to insert
     * @param index The index at which to insert the point
     */
    public insertControlPoint(point: Vector2D, index: number): void {
        if (index >= 0 && index <= this.controlPoints.length) {
            this.controlPoints.splice(index, 0, new Vector2D(point.x, point.y));
        }
    }

    /**
     * Remove a control point at the specified index
     * @param index The index of the control point to remove
     * @returns True if the point was successfully removed, false if the index is invalid
     */
    public removeControlPoint(index: number): boolean {
        if (index >= 0 && index < this.controlPoints.length) {
            this.controlPoints.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Returns the number of control points in the spline.
     * @returns The number of control points.
     */
    public controlPointCount(): number {
        return this.controlPoints.length;
    }

    /**
     * Get a control point at the specified index
     * @param index The index of the control point to retrieve
     * @returns A copy of the control point at the specified index, or null if the index is invalid
     */
    public getControlPoint(index: number): Vector2D | null {
        if (index >= 0 && index < this.controlPoints.length) {
            return new Vector2D(
                this.controlPoints[index].x,
                this.controlPoints[index].y
            );
        }
        return null;
    }

    /**
     * Update a control point at the specified index
     * @param index The index of the control point to update
     * @param point The new position for the control point
     * @returns True if the point was successfully updated, false if the index is invalid
     */
    public updateControlPoint(index: number, point: Vector2D): boolean {
        if (index >= 0 && index < this.controlPoints.length) {
            this.controlPoints[index] = new Vector2D(point.x, point.y);
            return true;
        }
        return false;
    }

    /**
     * Get the number of control points in the spline
     * @returns The number of control points
     */
    public getControlPointCount(): number {
        return this.controlPoints.length;
    }

    /**
     * Get all control points as a copy
     * @returns A copy of all control points
     */
    public getControlPoints(): Vector2D[] {
        return this.controlPoints.map(point => new Vector2D(point.x, point.y));
    }

    /**
     * Set the tension parameter for the spline
     * @param tension The tension value (0.0 = tight curves, 0.5 = standard, 1.0 = loose curves)
     */
    public setTension(tension: number): void {
        this.tension = Math.max(0, Math.min(1, tension));
    }

    /**
     * Get the current tension parameter
     * @returns The current tension value
     */
    public getTension(): number {
        return this.tension;
    }

    /**
     * Clear all control points from the spline
     */
    public clear(): void {
        this.controlPoints = [];
    }

    /**
     * Calculate a point on the Catmull-Rom spline
     * @param t The parameter value (0.0 to 1.0) representing position along the entire spline
     * @returns The interpolated point on the spline, or null if there are insufficient control points
     */
    public getPoint(t: number): Vector2D | null {
        if (this.controlPoints.length < 2) {
            return null;
        }

        // Clamp t to valid range
        t = Math.max(0, Math.min(1, t));

        // For splines with only 2 points, use linear interpolation
        if (this.controlPoints.length === 2) {
            return Vector2D.lerp(this.controlPoints[0], this.controlPoints[1], t);
        }

        // Calculate which segment we're in
        const segmentCount = this.controlPoints.length - 1;
        const segmentT = t * segmentCount;
        const segmentIndex = Math.floor(segmentT);
        const localT = segmentT - segmentIndex;

        // Handle edge case where t = 1.0
        if (segmentIndex >= segmentCount) {
            return new Vector2D(
                this.controlPoints[this.controlPoints.length - 1].x,
                this.controlPoints[this.controlPoints.length - 1].y
            );
        }

        return this.getPointOnSegment(segmentIndex, localT);
    }

    /**
     * Calculate a point on a specific segment of the spline
     * @param segmentIndex The index of the segment (0 to controlPoints.length - 2)
     * @param t The parameter value (0.0 to 1.0) along the segment
     * @returns The interpolated point on the segment
     */
    public getPointOnSegment(segmentIndex: number, t: number): Vector2D | null {
        if (segmentIndex < 0 || segmentIndex >= this.controlPoints.length - 1) {
            return null;
        }

        // Get the four control points needed for Catmull-Rom interpolation
        const p0 = this.getControlPointForSegment(segmentIndex - 1);
        const p1 = this.controlPoints[segmentIndex];
        const p2 = this.controlPoints[segmentIndex + 1];
        const p3 = this.getControlPointForSegment(segmentIndex + 2);

        return this.catmullRomInterpolate(p0, p1, p2, p3, t);
    }

    /**
     * Get a control point for segment calculation, handling edge cases
     * @param index The index of the control point
     * @returns The control point, using appropriate edge handling
     */
    private getControlPointForSegment(index: number): Vector2D {
        if (index < 0) {
            // For the point before the first, extrapolate backwards
            const p0 = this.controlPoints[0];
            const p1 = this.controlPoints[1];
            return p0.subtract(p1.subtract(p0));
        } else if (index >= this.controlPoints.length) {
            // For the point after the last, extrapolate forwards
            const p0 = this.controlPoints[this.controlPoints.length - 2];
            const p1 = this.controlPoints[this.controlPoints.length - 1];
            return p1.add(p1.subtract(p0));
        } else {
            return this.controlPoints[index];
        }
    }

    /**
     * Perform Catmull-Rom interpolation between four points
     * @param p0 The point before the start of the segment
     * @param p1 The start point of the segment
     * @param p2 The end point of the segment
     * @param p3 The point after the end of the segment
     * @param t The interpolation parameter (0.0 to 1.0)
     * @returns The interpolated point
     */
    private catmullRomInterpolate(p0: Vector2D, p1: Vector2D, p2: Vector2D, p3: Vector2D, t: number): Vector2D {
        const t2 = t * t;
        const t3 = t2 * t;

        // Catmull-Rom basis functions
        const b0 = -this.tension * t3 + 2 * this.tension * t2 - this.tension * t;
        const b1 = (2 - this.tension) * t3 + (this.tension - 3) * t2 + 1;
        const b2 = (this.tension - 2) * t3 + (3 - 2 * this.tension) * t2 + this.tension * t;
        const b3 = this.tension * t3 - this.tension * t2;

        const x = b0 * p0.x + b1 * p1.x + b2 * p2.x + b3 * p3.x;
        const y = b0 * p0.y + b1 * p1.y + b2 * p2.y + b3 * p3.y;

        return new Vector2D(x, y);
    }

    /**
     * Calculate the tangent vector at a specific point on the spline
     * @param t The parameter value (0.0 to 1.0) representing position along the entire spline
     * @returns The tangent vector at the specified point, or null if there are insufficient control points
     */
    public getTangent(t: number): Vector2D | null {
        if (this.controlPoints.length < 2) {
            return null;
        }

        // For splines with only 2 points, tangent is the direction vector
        if (this.controlPoints.length === 2) {
            return this.controlPoints[1].subtract(this.controlPoints[0]).normalize();
        }

        // Calculate which segment we're in
        const segmentCount = this.controlPoints.length - 1;
        const segmentT = t * segmentCount;
        const segmentIndex = Math.floor(segmentT);
        const localT = segmentT - segmentIndex;

        // Handle edge case where t = 1.0
        if (segmentIndex >= segmentCount) {
            return this.getTangentOnSegment(segmentCount - 1, 1.0);
        }

        return this.getTangentOnSegment(segmentIndex, localT);
    }

    /**
     * Calculate the tangent vector at a specific point on a segment
     * @param segmentIndex The index of the segment
     * @param t The parameter value (0.0 to 1.0) along the segment
     * @returns The tangent vector at the specified point
     */
    public getTangentOnSegment(segmentIndex: number, t: number): Vector2D | null {
        if (segmentIndex < 0 || segmentIndex >= this.controlPoints.length - 1) {
            return null;
        }

        // Get the four control points needed for tangent calculation
        const p0 = this.getControlPointForSegment(segmentIndex - 1);
        const p1 = this.controlPoints[segmentIndex];
        const p2 = this.controlPoints[segmentIndex + 1];
        const p3 = this.getControlPointForSegment(segmentIndex + 2);

        return this.catmullRomTangent(p0, p1, p2, p3, t);
    }

    /**
     * Calculate the tangent vector using Catmull-Rom interpolation
     * @param p0 The point before the start of the segment
     * @param p1 The start point of the segment
     * @param p2 The end point of the segment
     * @param p3 The point after the end of the segment
     * @param t The interpolation parameter (0.0 to 1.0)
     * @returns The tangent vector
     */
    private catmullRomTangent(p0: Vector2D, p1: Vector2D, p2: Vector2D, p3: Vector2D, t: number): Vector2D {
        const t2 = t * t;

        // Derivatives of Catmull-Rom basis functions
        const db0 = -3 * this.tension * t2 + 4 * this.tension * t - this.tension;
        const db1 = 3 * (2 - this.tension) * t2 + 2 * (this.tension - 3) * t;
        const db2 = 3 * (this.tension - 2) * t2 + 2 * (3 - 2 * this.tension) * t + this.tension;
        const db3 = 3 * this.tension * t2 - 2 * this.tension * t;

        const x = db0 * p0.x + db1 * p1.x + db2 * p2.x + db3 * p3.x;
        const y = db0 * p0.y + db1 * p1.y + db2 * p2.y + db3 * p3.y;

        return new Vector2D(x, y).normalize();
    }

    /**
     * Sample points along the spline at regular intervals
     * @param numSamples The number of points to sample (minimum 2)
     * @returns An array of sampled points along the spline
     */
    public samplePoints(numSamples: number): Vector2D[] {
        if (this.controlPoints.length < 2 || numSamples < 2) {
            return [];
        }

        const samples: Vector2D[] = [];
        for (let i = 0; i < numSamples; i++) {
            const t = i / (numSamples - 1);
            const point = this.getPoint(t);
            if (point) {
                samples.push(point);
            }
        }

        return samples;
    }

    /**
     * Calculate the approximate length of the spline
     * @param resolution The number of segments to use for approximation (higher = more accurate)
     * @returns The approximate length of the spline
     */
    public getLength(resolution: number = 100): number {
        if (this.controlPoints.length < 2) {
            return 0;
        }

        let length = 0;
        let previousPoint = this.getPoint(0);

        if (!previousPoint) {
            return 0;
        }

        for (let i = 1; i <= resolution; i++) {
            const t = i / resolution;
            const currentPoint = this.getPoint(t);
            
            if (currentPoint) {
                length += previousPoint.distanceTo(currentPoint);
                previousPoint = currentPoint;
            }
        }

        return length;
    }

    /**
     * Find the closest point on the spline to a given point
     * @param targetPoint The point to find the closest spline point to
     * @param resolution The resolution for the search (higher = more accurate but slower)
     * @returns An object containing the closest point and its parameter value t
     */
    public getClosestPoint(targetPoint: Vector2D, resolution: number = 100): { point: Vector2D; t: number } | null {
        if (this.controlPoints.length < 2) {
            return null;
        }

        let closestPoint: Vector2D | null = null;
        let closestDistance = Infinity;
        let closestT = 0;

        for (let i = 0; i <= resolution; i++) {
            const t = i / resolution;
            const splinePoint = this.getPoint(t);

            if (splinePoint) {
                const distance = targetPoint.distanceTo(splinePoint);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestPoint = splinePoint;
                    closestT = t;
                }
            }
        }

        return closestPoint ? { point: closestPoint, t: closestT } : null;
    }

    // public drawDebug(world: World): Graphics {
    //     // Draw the spline using PixiJS
    //     const graphics = new Graphics();
    //     world.addVisual(graphics);

    //     // Get points along the spline
    //     const splinePoints = this.samplePoints(50);

    //     // Draw the curve
    //     graphics.moveTo(splinePoints[0].x, splinePoints[0].y);
        
    //     for (let i = 1; i < splinePoints.length; i++) {
    //         graphics.lineTo(splinePoints[i].x, splinePoints[i].y);
    //     }
    //     graphics.stroke({width: 4, color: 0xff0000}); // Red line, 2px width

    //     for (const controlPoint of this.controlPoints){
    //         graphics.circle(controlPoint.x, controlPoint.y, 10)
    //         graphics.fill({color: 0x00ff00});
    //     }

    //     return graphics;


    //     // // Draw control point markers
    //     // for (const point of controlPoints) {
    //     //     graphics.beginFill(0x0000ff); // Blue circles for control points
    //     //     graphics.drawCircle(point.x, point.y, 3);
    //     //     graphics.endFill();
    //     // }
    // }
}