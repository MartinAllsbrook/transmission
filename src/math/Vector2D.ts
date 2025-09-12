/**
 * A class representing a 2D vector with x and y components.
 */
export class Vector2D {
    public x: number;
    public y: number;

    /**
     * Creates an instance of Vector2D.
     * @param x - The x component of the vector.
     * @param y - The y component of the vector.
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // #region Basic Methods

    /**
     * Returns a copy of the vector.
     * @returns A new Vector2D instance with the same x and y values.
     */
    public clone(): Vector2D {
        return new Vector2D(this.x, this.y);
    }

    /**
     * Sets the vector to the values of another vector.
     * @param vector - The vector to copy values from.
     * @returns The current vector instance.
     */
    public set(vector: Vector2D): Vector2D {
        this.x = vector.x;
        this.y = vector.y;
        return this;
    }

    /**
     * Checks if the current vector is equal to another vector.
     * @param vector - The vector to compare with.
     * @param epsilon - The tolerance for floating point comparison.
     * @returns True if the vectors are equal, false otherwise.
     */
    public equals(vector: Vector2D, epsilon = 0.001): boolean {
        return Math.abs(this.x - vector.x) < epsilon &&
            Math.abs(this.y - vector.y) < epsilon;
    }

    /**
     * Adds a vector to the current vector.
     * @param vector - The vector to add.
     * @returns A new Vector2D instance representing the sum.
     */
    public add(vector: Vector2D): Vector2D {
        const x = this.x + vector.x;
        const y = this.y + vector.y;

        return new Vector2D(x, y);
    }

    /**
     * Subtracts a vector from the current vector.
     * @param vector - The vector to subtract.
     * @returns A new Vector2D instance representing the difference.
     */
    public subtract(vector: Vector2D): Vector2D {
        const x = this.x - vector.x;
        const y = this.y - vector.y;

        return new Vector2D(x, y);
    }

    /**
     * Multiplies the vector by a scalar.
     * @param scalar - The scalar to multiply by.
     * @returns A new Vector2D instance representing the product.
     */
    public multiply(scalar: number): Vector2D {
        const x = this.x * scalar;
        const y = this.y * scalar;

        return new Vector2D(x, y);
    }

    /**
     * Returns a new vector with the same direction but with a magnitude of 1.
     * @returns A new Vector2D instance representing the normalized vector.
     */
    public normalize(): Vector2D {
        const magnitude = this.magnitude();

        if (magnitude === 0) {
            return new Vector2D(0, 0);
        }

        const x = this.x / magnitude;
        const y = this.y / magnitude;

        return new Vector2D(x, y);
    }

    /**
     * Returns the magnitude of the vector.
     * @returns The magnitude of the vector.
     */
    public magnitude(): number {
        return Math.sqrt(
            (Math.pow(Math.abs(this.x), 2)) + (Math.pow(Math.abs(this.y), 2)),
        );
    }

    /**
     * Returns the dot product of the vector and another vector.
     * @param vector - The vector to calculate the dot product with.
     * @returns The dot product of the two vectors.
     */
    public dot(vector: Vector2D): number {
        return this.x * vector.x + this.y * vector.y;
    }

    /**
     * Flips a vector to point in the opposite direction.
     * @returns A new Vector2D instance representing the negated vector.
     */
    public negate(): Vector2D {
        return new Vector2D(-this.x, -this.y);
    }

    /**
     * Rotates the vector by a given angle.
     * @param angle - The angle in radians to rotate the vector by.
     * @returns A new Vector2D instance representing the rotated vector.
     */
    public rotate(angle: number): Vector2D {
        const x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        const y = this.x * Math.sin(angle) + this.y * Math.cos(angle);

        return new Vector2D(x, y);
    }

    /**
     * Returns the angle of the vector in radians.
     * @returns The angle of the vector in radians.
     */
    public heading(): number {
        return Math.atan2(this.y, this.x);
    }

    /**
     * Returns a vector that is perpendicular to the current vector. (Clockwise)
     */
    public perpendicular(): Vector2D {
        return new Vector2D(this.y, -this.x);
    }

    // #endregion

    // #region Additional Methods

    /**
     * Gives the distance from this vector to another vector.
     * @param vector - The vector to get the distance to.
     * @returns The distance between the two vectors.
     */
    public distanceTo(vector: Vector2D): number {
        const deltaX = this.x - vector.x;
        const deltaY = this.y - vector.y;

        const delta = new Vector2D(deltaX, deltaY);

        return delta.magnitude();
    }

    /**
     * Returns the component of the vector that is in the direction of another vector.
     * @param vector - The vector to project onto.
     * @returns A new Vector2D instance representing the projected vector.
     */
    public projectOnto(vector: Vector2D): Vector2D {
        const scalar = this.dot(vector) / vector.magnitude();
        return vector.normalize().multiply(scalar);
    }

    /**
     * Returns vector in the same direction as the current vector with a specified magnitude.
     * @param magnitude - The magnitude of the new vector.
     * @returns A new Vector2D instance representing the scaled vector.
     */
    public setLength(magnitude: number): Vector2D {
        return this.normalize().multiply(magnitude);
    }

    // #endregion

    // #region Static Methods

    /**
     * Linearly interpolates between two vectors.
     * @param start - The starting vector.
     * @param end - The ending vector.
     * @param t - The interpolation factor (0 <= t <= 1).
     * @returns A new Vector2D instance representing the interpolated vector.
     */
    public static lerp(start: Vector2D, end: Vector2D, t: number): Vector2D {
        const x = start.x + t * (end.x - start.x);
        const y = start.y + t * (end.y - start.y);
        return new Vector2D(x, y);
    }

    /**
     * Returns a unit vector from an angle in radians.
     * @param angle - The angle in radians.
     * @returns A new Vector2D instance representing the unit vector.
     */
    public static fromAngle(angle: number): Vector2D {
        return new Vector2D(-Math.sin(angle), Math.cos(angle)).normalize();
    }

    /**
     * Returns a random normalized vector.
     * @returns A new Vector2D instance with random x and y values.
     */
    public static random(): Vector2D {
        return new Vector2D(Math.random() - 0.5, Math.random() - 0.5)
            .normalize();
    }

    // #endregion
}
