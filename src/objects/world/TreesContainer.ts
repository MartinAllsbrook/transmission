import { GameObject } from "../GameObject.ts";
import { World } from "./World.ts";
import { Graphics } from "pixi.js";

export class TreesContainer extends GameObject {
    private mask: Graphics | null = null;

    private width: number = 64;
    private height: number = 64; 

    constructor(parent: World) {
        super(parent);
        this.container.label = "TreesContainer";
        this.createCircleMask();
    }

    protected override async createOwnSprites(): Promise<void> {
        await super.createOwnSprites();
    }

    private createCircleMask(): void {
        // Create a circular mask
        this.mask = new Graphics();
        
        // Draw a circle in the middle of the screen
        this.mask.ellipse(128, 128, this.width, this.height);
        this.mask.fill(0xff0000); // Color doesn't matter for masks
        
        this.mask.label = "TreesContainerMask";

        // Apply the mask to this container
        this.container.mask = this.mask;
        
        // Add the mask to the parent container so it's part of the display tree
        // Note: Masks need to be added to the display tree to work properly
        if (this.parent) {
            this.parent.container.addChild(this.mask);
        }
    }

    public updateMaskPosition(centerX: number, centerY: number): void {
        if (this.mask) {
            this.mask.clear();
            this.mask.ellipse(globalThis.innerWidth / 2, globalThis.innerWidth / 2, this.width, this.height);
            this.mask.fill(0xffffff);
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