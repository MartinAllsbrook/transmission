import { Graphics } from "pixi.js";
import { Vector2D } from "../Vector2D.ts";
import { World } from "../../objects/world/World.ts";
import { GameObject } from "../../objects/GameObject.ts";

/**
 * A Catmull-Rom spline implementation that requires explicit definition of all control points.
 * The spline passes through the 2nd to 2nd-to-last control points only.
 * Requires a minimum of 4 control points for predictable behavior.
 * The first and last control points define the tangents but the curve doesn't pass through them.
 * 
 * Tension Parameter:
 * - 0.0: Tight curves, more angular transitions
 * - 0.5: Standard Catmull-Rom spline (recommended)
 * - 1.0: Loose curves, very smooth but may overshoot
 */
export class CatmullRomSpline {
    private controlPoints: Vector2D[];
    private tension: number;

    /**
     * Create a new CatmullRomSpline instance
     * @param controlPoints An array of Vector2D points (minimum 4 required)
     * @param tension The tension parameter (0.0 = tight curves, 0.5 = standard Catmull-Rom, 1.0 = loose curves)
     *                Controls the influence of tangent control points on curve smoothness.
     */
    constructor(controlPoints: Vector2D[] = [], tension: number = 0.5) {
        if (controlPoints.length > 0 && controlPoints.length < 4) {
            throw new Error("CatmullRomSpline requires at least 4 control points for explicit behavior");
        }
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
     * @returns True if a point was removed, false if there were insufficient points
     * @throws Error if attempting to remove a point would leave fewer than 4 control points
     */
    public popPoint(): boolean {
        if (this.controlPoints.length <= 4) {
            throw new Error("Cannot remove control point: CatmullRomSpline requires at least 4 control points");
        }
        this.controlPoints.pop();
        return true;
    }

    /**
     * Remove the first control point from the spline
     * @returns True if a point was removed, false if there were insufficient points
     * @throws Error if attempting to remove a point would leave fewer than 4 control points
     */
    public shiftPoint(): boolean {
        if (this.controlPoints.length <= 4) {
            throw new Error("Cannot remove control point: CatmullRomSpline requires at least 4 control points");
        }
        this.controlPoints.shift();
        return true;
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
     * @returns True if the point was successfully removed
     * @throws Error if the index is invalid or if removing would leave fewer than 4 control points
     */
    public removeControlPoint(index: number): boolean {
        if (index < 0 || index >= this.controlPoints.length) {
            throw new Error(`Invalid index ${index}: must be between 0 and ${this.controlPoints.length - 1}`);
        }
        if (this.controlPoints.length <= 4) {
            throw new Error("Cannot remove control point: CatmullRomSpline requires at least 4 control points");
        }
        this.controlPoints.splice(index, 1);
        return true;
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
     * @param tension The tension value (0.0 = tight curves, 0.5 = standard Catmull-Rom, 1.0 = loose curves)
     *                Controls how much the tangent control points influence the curve shape.
     *                Higher values create smoother curves but may cause more overshoot.
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
     * Note: After clearing, the spline will be invalid until at least 4 control points are added
     */
    public clear(): void {
        this.controlPoints = [];
    }

    /**
     * Check if the spline is valid (has at least 4 control points)
     * @returns True if the spline can be used for interpolation
     */
    public isValid(): boolean {
        return this.controlPoints.length >= 4;
    }

    /**
     * Get the number of interpolated segments in the spline
     * @returns The number of segments that can be interpolated (controlPoints.length - 3)
     */
    public getSegmentCount(): number {
        return Math.max(0, this.controlPoints.length - 3);
    }

    /**
     * Get the control points that the spline actually passes through
     * @returns Array of control points from index 1 to n-2 (the interpolated points)
     */
    public getInterpolatedControlPoints(): Vector2D[] {
        if (this.controlPoints.length < 4) {
            return [];
        }
        return this.controlPoints.slice(1, -1).map(point => new Vector2D(point.x, point.y));
    }

    /**
     * Get the tangent control points (first and last control points)
     * @returns Object with start and end tangent control points
     */
    public getTangentControlPoints(): { start: Vector2D | null; end: Vector2D | null } {
        if (this.controlPoints.length < 4) {
            return { start: null, end: null };
        }
        return {
            start: new Vector2D(this.controlPoints[0].x, this.controlPoints[0].y),
            end: new Vector2D(this.controlPoints[this.controlPoints.length - 1].x, this.controlPoints[this.controlPoints.length - 1].y)
        };
    }

    /**
     * Safe version of popPoint that returns false instead of throwing
     * @returns True if a point was removed, false if there were insufficient points
     */
    public tryPopPoint(): boolean {
        if (this.controlPoints.length <= 4) {
            return false;
        }
        this.controlPoints.pop();
        return true;
    }

    /**
     * Safe version of shiftPoint that returns false instead of throwing
     * @returns True if a point was removed, false if there were insufficient points
     */
    public tryShiftPoint(): boolean {
        if (this.controlPoints.length <= 4) {
            return false;
        }
        this.controlPoints.shift();
        return true;
    }

    /**
     * Safe version of removeControlPoint that returns false instead of throwing
     * @param index The index of the control point to remove
     * @returns True if the point was successfully removed, false if invalid or insufficient points
     */
    public tryRemoveControlPoint(index: number): boolean {
        if (index < 0 || index >= this.controlPoints.length || this.controlPoints.length <= 4) {
            return false;
        }
        this.controlPoints.splice(index, 1);
        return true;
    }

    /**
     * Calculate a point on the Catmull-Rom spline
     * @param t The parameter value (0.0 to 1.0) representing position along the interpolated portion of the spline
     *          t=0 corresponds to the 2nd control point, t=1 corresponds to the 2nd-to-last control point
     * @returns The interpolated point on the spline, or null if there are insufficient control points
     */
    public getPoint(t: number): Vector2D | null {
        if (this.controlPoints.length < 4) {
            return null;
        }

        // Clamp t to valid range
        t = Math.max(0, Math.min(1, t));

        // Calculate which segment we're in (segments between points 1 to n-2)
        const segmentCount = this.controlPoints.length - 3; // Number of interpolated segments
        const segmentT = t * segmentCount;
        const segmentIndex = Math.floor(segmentT);
        const localT = segmentT - segmentIndex;

        // Handle edge case where t = 1.0
        if (segmentIndex >= segmentCount) {
            return new Vector2D(
                this.controlPoints[this.controlPoints.length - 2].x,
                this.controlPoints[this.controlPoints.length - 2].y
            );
        }

        return this.getPointOnSegment(segmentIndex, localT);
    }

    /**
     * Calculate a point on a specific segment of the spline
     * @param segmentIndex The index of the segment (0 to controlPoints.length - 4)
     * @param t The parameter value (0.0 to 1.0) along the segment
     * @returns The interpolated point on the segment
     */
    public getPointOnSegment(segmentIndex: number, t: number): Vector2D | null {
        if (this.controlPoints.length < 4 || segmentIndex < 0 || segmentIndex >= this.controlPoints.length - 3) {
            return null;
        }

        // Get the four control points needed for Catmull-Rom interpolation
        // segmentIndex 0 uses control points 0,1,2,3
        // segmentIndex 1 uses control points 1,2,3,4, etc.
        const p0 = this.controlPoints[segmentIndex];
        const p1 = this.controlPoints[segmentIndex + 1];
        const p2 = this.controlPoints[segmentIndex + 2];
        const p3 = this.controlPoints[segmentIndex + 3];

        return this.catmullRomInterpolate(p0, p1, p2, p3, t);
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
     * @param t The parameter value (0.0 to 1.0) representing position along the interpolated portion of the spline
     * @returns The tangent vector at the specified point, or null if there are insufficient control points
     */
    public getTangent(t: number): Vector2D | null {
        if (this.controlPoints.length < 4) {
            return null;
        }

        // Calculate which segment we're in
        const segmentCount = this.controlPoints.length - 3;
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
        if (this.controlPoints.length < 4 || segmentIndex < 0 || segmentIndex >= this.controlPoints.length - 3) {
            return null;
        }

        // Get the four control points needed for tangent calculation
        const p0 = this.controlPoints[segmentIndex];
        const p1 = this.controlPoints[segmentIndex + 1];
        const p2 = this.controlPoints[segmentIndex + 2];
        const p3 = this.controlPoints[segmentIndex + 3];

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
     * @returns An array of sampled points along the interpolated portion of the spline
     */
    public samplePoints(numSamples: number): Vector2D[] {
        if (this.controlPoints.length < 4 || numSamples < 2) {
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
     * Calculate the approximate length of the interpolated portion of the spline
     * @param resolution The number of segments to use for approximation (higher = more accurate)
     * @returns The approximate length of the spline
     */
    public getLength(resolution: number = 100): number {
        if (this.controlPoints.length < 4) {
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
     * Find the closest point on the interpolated portion of the spline to a given point
     * @param targetPoint The point to find the closest spline point to
     * @param resolution The resolution for the search (higher = more accurate but slower)
     * @returns An object containing the closest point and its parameter value t
     */
    public getClosestPoint(targetPoint: Vector2D, resolution: number = 100): { point: Vector2D; t: number } | null {
        if (this.controlPoints.length < 4) {
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

    public drawDebug(world: World): Graphics {
        // Draw the spline using PixiJS
        const graphics = new Graphics();
        world.addVisual(graphics);

        if (this.controlPoints.length < 4) {
            return graphics; // Nothing to draw
        }

        // Get points along the interpolated spline
        const splinePoints = this.samplePoints(50);

        if (splinePoints.length > 0) {
            // Draw the curve
            graphics.moveTo(splinePoints[0].x, splinePoints[0].y);
            
            for (let i = 1; i < splinePoints.length; i++) {
                graphics.lineTo(splinePoints[i].x, splinePoints[i].y);
            }
            graphics.stroke({width: 4, color: 0xff0000}); // Red line, 4px width
        }

        // Draw all control points (green for tangent points, blue for interpolated points)
        for (let i = 0; i < this.controlPoints.length; i++) {
            const controlPoint = this.controlPoints[i];
            graphics.circle(controlPoint.x, controlPoint.y, 8);
            
            // First and last points are tangent control points (green)
            // Middle points are interpolated through (blue)
            if (i === 0 || i === this.controlPoints.length - 1) {
                graphics.fill({color: 0x00ff00}); // Green for tangent control points
            } else {
                graphics.fill({color: 0x0000ff}); // Blue for interpolated points
            }
        }

        return graphics;
    }
}