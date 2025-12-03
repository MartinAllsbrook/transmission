import { Vector2D } from "framework";

export interface PlayerConfig {
    // Initialization
    startPosition: Vector2D;

    // 2D Physics
    frictionStrength: number;
    gravityStrength: number;
    slipStrength: number;
    
    // Rotation
    rotationSpeed: number;
    rotationStrength: number;

    // Height & Air
    deltaDeltaHeight: number;
    jumpStrength: number;

    // Shifty
    shiftyLerpSpeed: number;
    shiftyMaxAngle: number;

    // Rail
    railCorrectionStrength: number;
}


export const PLAYER_CONFIG: Readonly<PlayerConfig> = {
    startPosition: new Vector2D(128, 128),

    frictionStrength: 0.1, // Raising this lowers top speed (max 1)
    gravityStrength: 140, // Raising this value makes the game feel faster
    slipStrength: 325, // Raising this value makes turning more responsive
    
    rotationSpeed: 250,
    rotationStrength: 10,

    deltaDeltaHeight: 4,
    jumpStrength: 4,

    shiftyLerpSpeed: 5, // Higher is snappier
    shiftyMaxAngle: 90, // Degrees

    railCorrectionStrength: 2, // Higher is more corrective
};