import { Point } from "pixi.js";
import { BezierSpline } from "../math/BezierSpline.ts";

export class ChunkGrid {
    grid: number[][];

    startingPoint: number;
    chunkSize: Point;
    endingPoint: number;

    splinePath: BezierSpline;

    constructor(
        startingPoint: number,
        size: Point = new Point(64, 64),
        endingPoint: number = Math.floor(Math.random() * size.x),
    ) {
        this.startingPoint = startingPoint;
        this.chunkSize = size;
        this.endingPoint = endingPoint;

        const rows = size.y;
        const cols = size.x;

        this.grid = Array.from({ length: rows }, () => Array(cols).fill(0));

        this.splinePath = new BezierSpline();
        this.splinePath.addControlPoint(new Point(0, this.startingPoint));
        this.splinePath.addControlPoint(
            new Point(size.x * 0.25, this.startingPoint),
        );
        this.splinePath.addControlPoint(
            new Point(size.x * 0.75, this.endingPoint),
        );
        this.splinePath.addControlPoint(new Point(size.x, this.endingPoint));

        this.drawPath();
    }

    public getCell(row: number, col: number): number | null {
        if (
            row < 0 || row >= this.grid.length || col < 0 ||
            col >= this.grid[0].length
        ) {
            return null;
        }
        return this.grid[row][col];
    }

    public setCell(row: number, col: number, value: number): void {
        if (
            row < 0 || row >= this.grid.length || col < 0 ||
            col >= this.grid[0].length
        ) {
            return;
        }
        this.grid[row][col] = value;
    }

    private drawPath(): void {
        for (let x = 0; x < this.chunkSize.x; x++) {
            for (let y = 0; y < this.chunkSize.y; y++) {
                const position = new Point(x, y);

                const distance = this.splinePath.getDistanceToPoint(
                    position,
                    50,
                );
                if (distance < 5) {
                    this.setCell(y, x, 1);
                }
            }
        }
    }

    public printGrid(): void {
        for (const row of this.grid) {
            const strRow = row.map((num) => num === 0 ? "#" : ".");
            console.log(strRow.join("  "));
        }
    }
}

if (import.meta.main) {
    const chunkGrid = new ChunkGrid(32);
    chunkGrid.setCell(2, 2, 1);
    chunkGrid.printGrid();
}
