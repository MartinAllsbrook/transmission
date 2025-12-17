import { Vector2D } from "../Vector2D.ts";

/**
 * A class for generating blue noise using Poisson disk sampling.
 * Blue noise creates evenly distributed points with a minimum distance between them.
 */
export class BlueNoise {
    /**
     * Generates blue noise points within a bounding box using Poisson disk sampling.
     * @param min - The minimum corner of the bounding box.
     * @param max - The maximum corner of the bounding box.
     * @param minDistance - The minimum distance between any two points.
     * @param maxAttempts - Maximum number of attempts to place a point around each active point (default: 30).
     * @returns An array of Vector2D points distributed with blue noise characteristics.
     */
    public static generate(
        min: Vector2D,
        max: Vector2D,
        minDistance: number,
        maxAttempts = 30,
    ): Vector2D[] {
        const width = max.x - min.x;
        const height = max.y - min.y;
        
        // Cell size should be minDistance / sqrt(2) to ensure only one point per cell
        const cellSize = minDistance / Math.sqrt(2);
        const cols = Math.ceil(width / cellSize);
        const rows = Math.ceil(height / cellSize);
        
        // Grid to track which cells contain points (for fast lookup)
        const grid: (Vector2D | null)[][] = Array(rows)
            .fill(null)
            .map(() => Array(cols).fill(null));
        
        const points: Vector2D[] = [];
        const activeList: Vector2D[] = [];
        
        // Start with a random initial point
        const initialPoint = new Vector2D(
            min.x + Math.random() * width,
            min.y + Math.random() * height,
        );
        
        points.push(initialPoint);
        activeList.push(initialPoint);
        
        const gridX = Math.floor((initialPoint.x - min.x) / cellSize);
        const gridY = Math.floor((initialPoint.y - min.y) / cellSize);
        grid[gridY][gridX] = initialPoint;
        
        // Process active list
        while (activeList.length > 0) {
            // Pick a random active point
            const randomIndex = Math.floor(Math.random() * activeList.length);
            const point = activeList[randomIndex];
            let found = false;
            
            // Try to generate a new point around it
            for (let i = 0; i < maxAttempts; i++) {
                // Generate random point in annulus between minDistance and 2*minDistance
                const angle = Math.random() * Math.PI * 2;
                const radius = minDistance + Math.random() * minDistance;
                
                const candidate = new Vector2D(
                    point.x + Math.cos(angle) * radius,
                    point.y + Math.sin(angle) * radius,
                );
                
                // Check if candidate is within bounds
                if (
                    candidate.x < min.x || candidate.x >= max.x ||
                    candidate.y < min.y || candidate.y >= max.y
                ) {
                    continue;
                }
                
                // Check if candidate is far enough from existing points
                const candidateGridX = Math.floor((candidate.x - min.x) / cellSize);
                const candidateGridY = Math.floor((candidate.y - min.y) / cellSize);
                
                if (this.isValidPoint(candidate, grid, minDistance, candidateGridX, candidateGridY)) {
                    points.push(candidate);
                    activeList.push(candidate);
                    grid[candidateGridY][candidateGridX] = candidate;
                    found = true;
                    break;
                }
            }
            
            // If no valid point was found, remove from active list
            if (!found) {
                activeList.splice(randomIndex, 1);
            }
        }
        
        return points;
    }
    
    /**
     * Checks if a candidate point is valid (far enough from all existing points).
     * @param candidate - The candidate point to check.
     * @param min - The minimum corner of the bounding box.
     * @param cellSize - The size of each grid cell.
     * @param grid - The grid containing existing points.
     * @param minDistance - The minimum distance between points.
     * @param gridX - The x grid coordinate of the candidate.
     * @param gridY - The y grid coordinate of the candidate.
     * @returns True if the point is valid, false otherwise.
     */
    private static isValidPoint(
        candidate: Vector2D,
        grid: (Vector2D | null)[][],
        minDistance: number,
        gridX: number,
        gridY: number,
    ): boolean {
        // Check neighboring cells
        const searchRadius = 2; // Check cells within 2 grid cells away
        
        for (let y = Math.max(0, gridY - searchRadius); y <= Math.min(grid.length - 1, gridY + searchRadius); y++) {
            for (let x = Math.max(0, gridX - searchRadius); x <= Math.min(grid[0].length - 1, gridX + searchRadius); x++) {
                const neighbor = grid[y][x];
                
                if (neighbor !== null) {
                    const distance = candidate.distanceTo(neighbor);
                    if (distance < minDistance) {
                        return false;
                    }
                }
            }
        }
        
        return true;
    }

    /**
     * Generates blue noise points with automatic minimum distance based on density. Uses ideal hexagonal packing to estimate minDistance.
     * @param min - The minimum corner of the bounding box.
     * @param max - The maximum corner of the bounding box.
     * @param targetCount - Approximate number of points to generate.
     * @param maxAttempts - Maximum number of attempts to place a point around each active point (default: 30).
     * @returns An array of Vector2D points distributed with blue noise characteristics.
     */
    public static generateWithCount(
        min: Vector2D,
        max: Vector2D,
        targetCount: number,
        maxAttempts = 30,
    ): Vector2D[] {
        const width = max.x - min.x;
        const height = max.y - min.y;
        const area = width * height;
        
        // Calculate minDistance based on target count
        // Area per point = total area / count
        // Assume hexagonal packing: minDistance ≈ sqrt(2 * area / (count * sqrt(3)))
        const minDistance = Math.sqrt((2 * area) / (targetCount * Math.sqrt(3)));
        
        return this.generate(min, max, minDistance, maxAttempts);
    }
}
