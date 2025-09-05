import { Point } from "pixi.js";

/**
 * A simple 2D Bézier spline class using PIXI.js Point as vectors
 */
export class BezierSpline {
    private controlPoints: Point[];

    /**
     * Create a new BezierSpline instance
     * @param controlPoints An optional array of Points to use as initial control points
     */
    constructor(controlPoints: Point[] = []) {
        this.controlPoints = [...controlPoints];
    }

    /**
     * Add a control point to the spline
     * @param point The Point to add to the spline
     */
    addControlPoint(point: Point): void {
        this.controlPoints.push(new Point(point.x, point.y));
    }

    /**
     * Remove a control point at the specified index
     * @param index The index of the control point to remove
     * @returns True if the point was successfully removed, false if the index is invalid
     */
    removeControlPoint(index: number): boolean {
        if (index >= 0 && index < this.controlPoints.length) {
            this.controlPoints.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Get a control point at the specified index
     * @param index The index of the control point to retrieve
     * @returns A copy of the control point at the specified index, or null if the index is invalid
     */
    getControlPoint(index: number): Point | null {
        if (index >= 0 && index < this.controlPoints.length) {
            return new Point(this.controlPoints[index].x, this.controlPoints[index].y);
        }
        return null;
    }

    /**
     * Set a control point at the specified index
     * @param index The index of the control point to update
     * @param point The new Point to set at the specified index
     * @returns True if the point was successfully set, false if the index is invalid
     */
    setControlPoint(index: number, point: Point): boolean {
        if (index >= 0 && index < this.controlPoints.length) {
            this.controlPoints[index].x = point.x;
            this.controlPoints[index].y = point.y;
            return true;
        }
        return false;
    }

    /**
     * Get all control points
     * @returns An array of copies of all control points
     */
    getControlPoints(): Point[] {
        return this.controlPoints.map(p => new Point(p.x, p.y));
    }

    /**
     * Set all control points
     * @param points An array of Points to use as the new control points
     */
    setControlPoints(points: Point[]): void {
        this.controlPoints = points.map(p => new Point(p.x, p.y));
    }

    /**
     * Get the number of control points
     * @returns The total number of control points in the spline
     */
    getPointCount(): number {
        return this.controlPoints.length;
    }

    /**
     * Calculate a point on the Bézier curve at parameter t (0 <= t <= 1)
     * Uses De Casteljau's algorithm for any number of control points
     * @param t The parameter value between 0 and 1 (will be clamped to this range)
     * @returns A Point on the Bézier curve at parameter t
     */
    getPointAt(t: number): Point {
        if (this.controlPoints.length === 0) {
            return new Point(0, 0);
        }

        if (this.controlPoints.length === 1) {
            return new Point(this.controlPoints[0].x, this.controlPoints[0].y);
        }

        // Clamp t to [0, 1]
        t = Math.max(0, Math.min(1, t));

        // De Casteljau's algorithm
        const points = this.controlPoints.map(p => new Point(p.x, p.y));
        
        for (let level = 1; level < this.controlPoints.length; level++) {
            for (let i = 0; i < this.controlPoints.length - level; i++) {
                points[i].x = (1 - t) * points[i].x + t * points[i + 1].x;
                points[i].y = (1 - t) * points[i].y + t * points[i + 1].y;
            }
        }

        return points[0];
    }

    /**
     * Calculate the derivative (tangent vector) at parameter t
     * @param t The parameter value between 0 and 1 (will be clamped to this range)
     * @returns A Point representing the tangent vector at parameter t
     */
    getDerivativeAt(t: number): Point {
        if (this.controlPoints.length < 2) {
            return new Point(0, 0);
        }

        // Clamp t to [0, 1]
        t = Math.max(0, Math.min(1, t));

        // Create derivative control points
        const derivativePoints: Point[] = [];
        const n = this.controlPoints.length - 1;

        for (let i = 0; i < n; i++) {
            const dx = n * (this.controlPoints[i + 1].x - this.controlPoints[i].x);
            const dy = n * (this.controlPoints[i + 1].y - this.controlPoints[i].y);
            derivativePoints.push(new Point(dx, dy));
        }

        // Calculate point on derivative curve
        const points = derivativePoints;
        
        for (let level = 1; level < derivativePoints.length; level++) {
            for (let i = 0; i < derivativePoints.length - level; i++) {
                points[i].x = (1 - t) * points[i].x + t * points[i + 1].x;
                points[i].y = (1 - t) * points[i].y + t * points[i + 1].y;
            }
        }

        return points[0];
    }

    /**
     * Get multiple points along the curve for rendering
     * @param numPoints The number of points to generate along the curve (minimum 2)
     * @returns An array of Points evenly distributed along the curve
     */
    getPoints(numPoints: number = 100): Point[] {
        if (numPoints < 2) numPoints = 2;
        
        const points: Point[] = [];
        
        for (let i = 0; i < numPoints; i++) {
            const t = i / (numPoints - 1);
            points.push(this.getPointAt(t));
        }
        
        return points;
    }

    /**
     * Calculate the approximate length of the curve
     * @param segments The number of line segments to use for approximation (higher = more accurate)
     * @returns The approximate length of the curve
     */
    getLength(segments: number = 100): number {
        if (this.controlPoints.length < 2) return 0;

        let length = 0;
        let previousPoint = this.getPointAt(0);

        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const currentPoint = this.getPointAt(t);
            
            const dx = currentPoint.x - previousPoint.x;
            const dy = currentPoint.y - previousPoint.y;
            length += Math.sqrt(dx * dx + dy * dy);
            
            previousPoint = currentPoint;
        }

        return length;
    }

    /**
     * Find the closest point on the curve to a given point
     * @param targetPoint The point to find the closest curve point to
     * @param precision The number of sample points to check along the curve (higher = more accurate)
     * @returns An object containing the closest point on the curve and its parameter t value
     */
    getClosestPoint(targetPoint: Point, precision: number = 100): { point: Point; t: number } {
        let closestPoint = new Point(0, 0);
        let closestT = 0;
        let minDistance = Infinity;

        for (let i = 0; i <= precision; i++) {
            const t = i / precision;
            const point = this.getPointAt(t);
            
            const dx = point.x - targetPoint.x;
            const dy = point.y - targetPoint.y;
            const distance = dx * dx + dy * dy;

            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = point;
                closestT = t;
            }
        }

        return { point: closestPoint, t: closestT };
    }

    /**
     * Calculate the distance between a given point and the closest point on the spline
     * @param targetPoint The point to measure distance from
     * @param precision The number of sample points to check along the curve (higher = more accurate)
     * @returns The Euclidean distance between the target point and the closest point on the spline
     */
    getDistanceToPoint(targetPoint: Point, precision: number = 100): number {
        const closest = this.getClosestPoint(targetPoint, precision);
        const dx = closest.point.x - targetPoint.x;
        const dy = closest.point.y - targetPoint.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Create a cubic Bézier curve (4 control points)
     * @param p0 The starting point of the curve
     * @param p1 The first control point
     * @param p2 The second control point
     * @param p3 The ending point of the curve
     * @returns A new BezierSpline instance with the specified cubic curve
     */
    static createCubic(p0: Point, p1: Point, p2: Point, p3: Point): BezierSpline {
        return new BezierSpline([p0, p1, p2, p3]);
    }

    /**
     * Create a quadratic Bézier curve (3 control points)
     * @param p0 The starting point of the curve
     * @param p1 The control point
     * @param p2 The ending point of the curve
     * @returns A new BezierSpline instance with the specified quadratic curve
     */
    static createQuadratic(p0: Point, p1: Point, p2: Point): BezierSpline {
        return new BezierSpline([p0, p1, p2]);
    }

    /**
     * Create a linear "curve" (2 control points)
     * @param p0 The starting point of the line
     * @param p1 The ending point of the line
     * @returns A new BezierSpline instance with the specified linear curve
     */
    static createLinear(p0: Point, p1: Point): BezierSpline {
        return new BezierSpline([p0, p1]);
    }
}
