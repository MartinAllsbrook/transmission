import { Point } from "pixi.js";
import { BezierSpline } from "src/objects/BezierSpline.ts";

/**
 * Example usage of the BezierSpline class
 */
export class BezierSplineExample {
    /**
     * Create a simple quadratic Bézier curve example
     */
    static createQuadraticExample(): BezierSpline {
        const p0 = new Point(0, 0); // Start point
        const p1 = new Point(50, 100); // Control point
        const p2 = new Point(100, 0); // End point

        return BezierSpline.createQuadratic(p0, p1, p2);
    }

    /**
     * Create a cubic Bézier curve example
     */
    static createCubicExample(): BezierSpline {
        const p0 = new Point(0, 0); // Start point
        const p1 = new Point(25, 75); // First control point
        const p2 = new Point(75, 75); // Second control point
        const p3 = new Point(100, 0); // End point

        return BezierSpline.createCubic(p0, p1, p2, p3);
    }

    /**
     * Create a more complex spline with multiple control points
     */
    static createComplexExample(): BezierSpline {
        const spline = new BezierSpline();

        spline.addControlPoint(new Point(0, 50));
        spline.addControlPoint(new Point(20, 100));
        spline.addControlPoint(new Point(40, 0));
        spline.addControlPoint(new Point(60, 80));
        spline.addControlPoint(new Point(80, 20));
        spline.addControlPoint(new Point(100, 50));

        return spline;
    }

    /**
     * Demonstrate various operations on a Bézier spline
     */
    static demonstrateOperations(): void {
        console.log("=== Bézier Spline Example ===");

        // Create a cubic curve
        const spline = BezierSplineExample.createCubicExample();

        console.log(`Number of control points: ${spline.getPointCount()}`);
        console.log(`Curve length: ${spline.getLength().toFixed(2)}`);

        // Get some points along the curve
        const curvePoints = spline.getPoints(10);
        console.log("Points along the curve:");
        curvePoints.forEach((point, index) => {
            const t = index / (curvePoints.length - 1);
            console.log(
                `  t=${t.toFixed(2)}: (${point.x.toFixed(2)}, ${
                    point.y.toFixed(2)
                })`,
            );
        });

        // Get derivatives at some points
        console.log("Derivatives (tangent vectors):");
        for (let i = 0; i <= 4; i++) {
            const t = i / 4;
            const derivative = spline.getDerivativeAt(t);
            console.log(
                `  t=${t.toFixed(2)}: (${derivative.x.toFixed(2)}, ${
                    derivative.y.toFixed(2)
                })`,
            );
        }

        // Find closest point to a target
        const target = new Point(50, 40);
        const closest = spline.getClosestPoint(target);
        console.log(`Closest point to (${target.x}, ${target.y}):`);
        console.log(
            `  Point: (${closest.point.x.toFixed(2)}, ${
                closest.point.y.toFixed(2)
            })`,
        );
        console.log(`  Parameter t: ${closest.t.toFixed(3)}`);
    }

    /**
     * Example of modifying a spline dynamically
     */
    static demonstrateModification(): BezierSpline {
        const spline = new BezierSpline();

        // Start with a simple line
        spline.addControlPoint(new Point(0, 0));
        spline.addControlPoint(new Point(100, 100));

        console.log("Initial line from (0,0) to (100,100)");
        console.log(`Length: ${spline.getLength().toFixed(2)}`);

        // Add control points to make it curved
        spline.addControlPoint(new Point(200, 50));
        console.log("Added third control point at (200,50)");
        console.log(`New length: ${spline.getLength().toFixed(2)}`);

        // Modify an existing control point
        spline.setControlPoint(1, new Point(50, 150));
        console.log("Modified second control point to (50,150)");
        console.log(`Final length: ${spline.getLength().toFixed(2)}`);

        return spline;
    }
}

// Uncomment to run examples:
// BezierSplineExample.demonstrateOperations();
// BezierSplineExample.demonstrateModification();
