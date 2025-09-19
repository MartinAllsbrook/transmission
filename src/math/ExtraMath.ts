/**
 * A utility class providing additional mathematical functions.
 * 
 * @remarks
 * The `ExtraMath` class includes static methods for common mathematical operations
 * such as linear interpolation, with both standard and safe (clamped) variants.
 */


export class ExtraMath {
    /**
     * Performs a linear interpolation between two values.
     *
     * @remarks
     * The `lerp` method calculates the value between `start` and `end` based on the interpolation factor `t`.
     * When `t` is 0, the result is `start`. When `t` is 1, the result is `end`. Values of `t` outside the range [0, 1]
     * will extrapolate beyond `start` and `end`.
     *
     * @param start - The starting value of the interpolation.
     * @param end - The ending value of the interpolation.
     * @param t - The interpolation factor, where 0 returns `start` and 1 returns `end`.
     * @returns The interpolated value between `start` and `end`.
     */
    public static lerp(start: number, end: number, t: number): number {
        return start + (end - start) * t;
    }

    /**
     * Performs a linear interpolation between `start` and `end`, clamping the interpolation factor `t` to the range [0, 1].
     *
     * @remarks
     * This method ensures that the interpolation factor `t` is always within the valid range for interpolation.
     * If `t` is less than 0, it will be treated as 0. If `t` is greater than 1, it will be treated as 1.
     * This prevents extrapolation beyond the `start` and `end` values.
     *
     * @param start - The starting value of the interpolation.
     * @param end - The ending value of the interpolation.
     * @param t - The interpolation factor, typically between 0 and 1.
     * @returns The interpolated value, clamped between `start` and `end`.
     */
    public static lerpSafe(start: number, end: number, t: number): number {
        t = Math.max(0, Math.min(1, t));
        return start + (end - start) * t;
    }

    /**
     * Calculates the difference between two angles in degrees.
     *
     * The function returns the smallest (default) or largest difference between two angles,
     * properly handling angles outside the [0, 360) range (e.g., 1080, -90).
     *
     * @param angle1 - The first angle in degrees.
     * @param angle2 - The second angle in degrees.
     * @param findLarger - If true, returns the larger difference; otherwise, returns the smaller (default: false).
     * @returns The angle difference in degrees (always positive).
     */
    public static angleDifference(angle1: number, angle2: number, findLarger: boolean = false): number {
        // Normalize angles to [0, 360)
        const a1 = ((angle1 % 360) + 360) % 360;
        const a2 = ((angle2 % 360) + 360) % 360;
        // Find absolute difference
        const diff = Math.abs(a1 - a2);
        const minDiff = diff > 180 ? 360 - diff : diff;
        if (findLarger) {
            return 360 - minDiff;
        } else {
            return minDiff;
        }
    }
    
}