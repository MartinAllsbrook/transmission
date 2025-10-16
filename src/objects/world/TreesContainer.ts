import { GameObject } from "../../framework/GameObject.ts";
import { World } from "./World.ts";
import { Sprite } from "pixi.js";

export class TreesContainer extends GameObject {
    private mask: Sprite | null = null;

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

    private async createCircleMask(): Promise<void> {
        // Create a mask that covers everything EXCEPT the circular hole
        this.mask = await this.loadSprite("/Mask.png", { makeChild: false });
        this.mask.scale.set(2,2);
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
            this.mask.position.set(centerX, centerY);
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