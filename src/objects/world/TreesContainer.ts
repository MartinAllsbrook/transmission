import { GameObject } from "../GameObject.ts";
import { World } from "./World.ts";
import { Graphics } from "pixi.js";

export class TreesContainer extends GameObject {
    private mask: Graphics | null = null;

    private width: number = 32;
    private height: number = 32; 

    constructor(parent: World) {
        super(parent);
        this.container.label = "TreesContainer";
    }
    
    protected override async createOwnSprites(): Promise<void> {
        await super.createOwnSprites();
        this.createCircleMask();
    }

    private createCircleMask(): void {
        // Create a mask that covers everything EXCEPT the circular hole
        this.mask = new Graphics();
        
        // Create a large rectangle that covers the entire screen area
        const screenWidth = globalThis.innerWidth;
        const screenHeight = globalThis.innerHeight;
        
        // Draw the outer rectangle (visible area)
        this.mask.rect(-screenWidth, -screenHeight, screenWidth * 2, screenHeight * 2);
        this.mask.fill({ color: 0xffffff, alpha: 1 });
        
        // Cut out a circular hole by drawing a circle and using it to cut from the rectangle
        this.mask.ellipse(128, 128, this.width, this.height);
        this.mask.cut();
        
        this.mask.label = "TreesContainerMask";
        
        // Apply the mask to this container
        this.container.mask = this.mask;
        
        // Add the mask to the parent container so it's part of the display tree
        // Note: Masks need to be added to the display tree to work properly
        if (this.parent) {
            this.parent.container.addChild(this.mask);
        }

        this.mask.alpha = 0.5;

    }

    public updateMaskPosition(centerX: number, centerY: number): void {
        if (this.mask) {
            console.log(`Updating mask position to (${centerX}, ${centerY})`);

            // Clear the existing mask and redraw it at the new position
            this.mask.clear();
            
            // Create a large rectangle that covers the entire screen area
            const screenWidth = globalThis.innerWidth;
            const screenHeight = globalThis.innerHeight;
            
            // Draw the outer rectangle (visible area)
            this.mask.rect(-screenWidth + centerX, -screenHeight + centerY, screenWidth * 2, screenHeight * 2);
            this.mask.fill({ color: 0xffffff, alpha: 0.5 });
            
            // Cut out a circular hole at the specified position
            this.mask.ellipse(centerX, centerY, this.width, this.height);
            this.mask.cut();
            this.mask.alpha = 0.5;
        }   
    }

    public override destroy(): void {
        // Clean up the mask
        if (this.mask) {
            this.mask.destroy();
            this.mask = null;
        }
        super.destroy();
    }
}