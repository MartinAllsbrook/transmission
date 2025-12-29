import { Vector2D } from "framework";

export interface PlayerConfig {
    // Initialization
    /**
     * The starting position of the player in the world.
     */
    startPosition: Vector2D;

    // 2D Physics
    /**
     * The friction strength applied to the player's movement.
     * Raising this lowers top speed (max 1).
     */
    frictionStrength: number;
    /**
     * The strength of gravity affecting the player.
     * Raising this value makes the game feel faster
     */
    gravityStrength: number;
    /**
     * The resistance to lateral movement when turning.
     * Raising this value makes turning more responsive.
     */
    slipStrength: number;

    // Rotation
    /**
     * The maximum rotation speed of the player in degrees per second, while on ground.
     */
    maxRotationSpeed: number;
    /**
     * The strength of rotation acceleration, using lerping.
     * Raising this value makes rotation more responsive, but less fluid.
     */
    rotationStrength: number;

    // Height & Air
    /**
     * The rate of change of the player's vertical speed, essentially gravity but in the out of screen axis.
     * Raising this value makes jumps less floaty.
     */
    deltaDeltaHeight: number;
    /**
     * The initial vertical speed applied when the player jumps.
     * Raising this value makes the base height of jumps higher.
     */
    jumpStrength: number;

    /**
     * The furthest the player can "twist" their body during a shifty in degrees.
     * The maximum difference between board angle and body angle.
     */
    shiftyMaxAngle: number;
    /**
     * Similar to rotationStrength, this controls how quickly the player can perform a shifty.
     * Higher values make the shifty snappier, but less fluid.
     */
    shiftyStrength: number;

    // Rail
    railCorrectionStrength: number;
}

export const PLAYER_CONFIG: Readonly<PlayerConfig> = {
    startPosition: new Vector2D(128, 128),

    frictionStrength: 0.1, 
    gravityStrength: 140,
    slipStrength: 325,

    maxRotationSpeed: 250,
    rotationStrength: 10,

    deltaDeltaHeight: 4,
    jumpStrength: 4,

    // Shifty
    shiftyStrength: 5, // Higher is snappier
    shiftyMaxAngle: 90, // Degrees

    railCorrectionStrength: 2, // Higher is more corrective
};
