import { BezierSpline } from "src/math/splines/BezierSpline.ts";
import { Vector2D } from "src/math/Vector2D.ts";

/**
 * Simple tests for the BezierSpline class
 */
export function testBezierSpline(): boolean {
    console.log("Running BezierSpline tests...");

    try {
        // Test 1: Linear interpolation (2 points)
        const linear = BezierSpline.createLinear(
            new Vector2D(0, 0),
            new Vector2D(10, 10),
        );
        const midPoint = linear.getPointAt(0.5);

        if (
            Math.abs(midPoint.x - 5) > 0.001 || Math.abs(midPoint.y - 5) > 0.001
        ) {
            console.error("Test 1 failed: Linear interpolation incorrect");
            return false;
        }
        console.log("✓ Test 1 passed: Linear interpolation");

        // Test 2: Quadratic curve endpoints
        const quad = BezierSpline.createQuadratic(
            new Vector2D(0, 0),
            new Vector2D(5, 10),
            new Vector2D(10, 0),
        );

        const start = quad.getPointAt(0);
        const end = quad.getPointAt(1);

        if (
            Math.abs(start.x - 0) > 0.001 || Math.abs(start.y - 0) > 0.001 ||
            Math.abs(end.x - 10) > 0.001 || Math.abs(end.y - 0) > 0.001
        ) {
            console.error("Test 2 failed: Quadratic curve endpoints incorrect");
            return false;
        }
        console.log("✓ Test 2 passed: Quadratic curve endpoints");

        // Test 3: Control point manipulation
        const spline = new BezierSpline();
        spline.addControlPoint(new Vector2D(0, 0));
        spline.addControlPoint(new Vector2D(10, 10));

        if (spline.getPointCount() !== 2) {
            console.error("Test 3 failed: Control point count incorrect");
            return false;
        }

        spline.setControlPoint(0, new Vector2D(5, 5));
        const modified = spline.getControlPoint(0);

        if (
            !modified || Math.abs(modified.x - 5) > 0.001 ||
            Math.abs(modified.y - 5) > 0.001
        ) {
            console.error(
                "Test 3 failed: Control point modification incorrect",
            );
            return false;
        }
        console.log("✓ Test 3 passed: Control point manipulation");

        // Test 4: Curve length calculation
        const line = BezierSpline.createLinear(
            new Vector2D(0, 0),
            new Vector2D(3, 4),
        );
        const length = line.getLength();
        const expectedLength = 5; // 3-4-5 triangle

        if (Math.abs(length - expectedLength) > 0.1) {
            console.error(
                `Test 4 failed: Length calculation incorrect. Expected ~${expectedLength}, got ${length}`,
            );
            return false;
        }
        console.log("✓ Test 4 passed: Curve length calculation");

        // Test 5: Derivative calculation for linear curve
        const derivative = line.getDerivativeAt(0.5);
        // For a linear curve from (0,0) to (3,4), derivative should be constant (3,4)

        if (
            Math.abs(derivative.x - 3) > 0.001 ||
            Math.abs(derivative.y - 4) > 0.001
        ) {
            console.error("Test 5 failed: Linear derivative incorrect");
            return false;
        }
        console.log("✓ Test 5 passed: Derivative calculation");

        console.log("All tests passed! ✅");
        return true;
    } catch (error) {
        console.error("Test failed with error:", error);
        return false;
    }
}

// Uncomment to run tests:
// testBezierSpline();
