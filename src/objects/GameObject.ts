import { Application, Container, Graphics } from "pixi.js";
import { Vector2D } from "src/math/Vector2D.ts";

export type Parent = Application | GameObject;

/**
 * Base class for all game objects in the game.
 */
export abstract class GameObject {
    protected position: Vector2D;
    rotation: number;
    size: Vector2D;
    scale: Vector2D;

    parent: GameObject | null = null;
    children: GameObject[] = [];
    container: Container = new Container();

    onSpriteLoaded: (() => void)[] = [];

    constructor(
        parent: Parent,
        position: Vector2D,
        size: Vector2D,
        rotation: number = 0,
        scale: Vector2D = new Vector2D(1, 1),
    ) {
        this.position = position;
        this.rotation = rotation;
        this.size = size;
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

        this.onSpriteLoaded.forEach((callback) => callback());
    }

    /**
     * Method to update the game object each frame. Called with the time delta since the last frame.
     * @param deltaTime Time in milliseconds since the last frame.
     */
    public update(_deltaTime: number): void {
        this.container.position.set(
            this.position.x,
            this.position.y,
        );
        this.container.rotation = this.rotation * (Math.PI / 180);
        // this.container.scale.set(this.scale.x, this.scale.y);

        this.children.forEach((child) => child.update(_deltaTime));
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
        child.position.set(this.container.pivot.x, this.container.pivot.y);
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

    get Position(): Vector2D {
        return this.position;
    }

    get WorldPosition(): Vector2D {
        if (this.parent) {
            return this.parent.WorldPosition.add(this.position);
        } else {
            return this.position;
        }
    }
}
