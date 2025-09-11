import { Point, Container, Application } from "pixi.js";

export type Parent = Application | GameObject;

/**
 * Base class for all game objects in the game.
 */
export abstract class GameObject {
    position: Point;
    rotation: number;
    scale: Point;

    parent: GameObject | null = null;
    children: GameObject[] = [];
    container: Container = new Container();

    constructor(
        parent: Parent,
        position: Point, 
        rotation: number = 0, 
        scale: Point = new Point(1, 1)
    ) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;

        this.createSprite();

        if (parent instanceof GameObject) {
            parent.addChild(this);
            this.parent = parent;
        } else if (parent instanceof Application) {
            parent.stage.addChild(this.container);
        } else {
            throw new Error("Invalid parent type");
        }
    }

    protected createSprite() {
        this.container.pivot.x = this.container.width / 2;
        this.container.pivot.y = this.container.height / 2;

        this.container.position.set(this.position.x, this.position.y);
        this.container.rotation = this.rotation * (Math.PI / 180);
        this.container.scale.set(this.scale.x, this.scale.y);
    }

    /**
     * Method to update the game object each frame. Called with the time delta since the last frame.
     * @param deltaTime Time in milliseconds since the last frame.
     */
    public update(_deltaTime: number): void {
        const screenCenter = new Point(
            globalThis.window.innerWidth / 2, 
            globalThis.window.innerHeight / 2
        );

        this.container.position.set(this.position.x + screenCenter.x, this.position.y + screenCenter.y);
        this.container.rotation = this.rotation * (Math.PI / 180);
        // this.container.scale.set(this.scale.x, this.scale.y);
    }

    /**
     * Gets the game object's container for adding child display objects.
     * @returns The PIXI.Container associated with this game object.
     */
    private getContainer(): Container {
        return this.container;
    }

    /** 
     * Adds visual elements (like sprites or graphics) directly to the game object's PIXI container.
     */
    public addVisual(child: Container): void {
        this.container.addChild(child);
    }

    public addChild(child: GameObject): void {
        this.children.push(child);
        this.container.addChild(child.getContainer());
    }

    destroy(): void {
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index > -1) {
                this.parent.children.splice(index, 1);
            }
        }

        this.container.destroy({ children: true });
    }
}