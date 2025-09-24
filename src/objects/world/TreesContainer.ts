import { GameObject } from "../GameObject.ts";
import { World } from "./World.ts";
import { Graphics } from "pixi.js";

export class TreesContainer extends GameObject {
    private circleMask: Graphics | null = null;

    constructor(parent: World) {
        super(parent);
        this.container.label = "TreesContainer";
    }

    protected override async createOwnSprites(): Promise<void> {
        await super.createOwnSprites();
        this.createCircleMask();
    }

    private createCircleMask(): void {
        // Create a circular mask
        this.circleMask = new Graphics();
        
        // Get screen dimensions (you might want to get this from your app or parent)
        const screenWidth = 800; // Replace with your actual screen width
        const screenHeight = 600; // Replace with your actual screen height
        const radius = Math.min(screenWidth, screenHeight) / 4; // Adjust radius as needed
        
        // Draw a circle in the middle of the screen
        this.circleMask.circle(screenWidth / 2, screenHeight / 2, radius);
        this.circleMask.fill(0xffffff); // Color doesn't matter for masks
        
        // Apply the mask to this container
        this.container.mask = this.circleMask;
        
        // Add the mask to the parent container so it's part of the display tree
        // Note: Masks need to be added to the display tree to work properly
        if (this.parent) {
            this.parent.container.addChild(this.circleMask);
        }
    }

    public updateMaskPosition(centerX: number, centerY: number): void {
        if (this.circleMask) {
            this.circleMask.clear();
            const radius = 150; // Adjust radius as needed
            this.circleMask.circle(centerX, centerY, radius);
            this.circleMask.fill(0xffffff);
        }
    }

    public setMaskRadius(radius: number): void {
        if (this.circleMask) {
            this.circleMask.clear();
            // Get current position from the mask's bounds or use screen center
            const screenWidth = 800; // Replace with your actual screen width
            const screenHeight = 600; // Replace with your actual screen height
            this.circleMask.circle(screenWidth / 2, screenHeight / 2, radius);
            this.circleMask.fill(0xffffff);
        }
    }

    public override destroy(): void {
        // Clean up the mask
        if (this.circleMask) {
            this.circleMask.destroy();
            this.circleMask = null;
        }
        super.destroy();
    }
}