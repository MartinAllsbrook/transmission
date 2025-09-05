import { Point, Container } from "pixi.js";

/**
 * Base class for all game objects in the game.
 */
export abstract class GameObject {
    position: Point;
    rotation: number;
    scale: Point;

    container: Container = new Container();

    constructor(
        parent: Container,
        position: Point, 
        rotation: number = 0, 
        scale: Point = new Point(1, 1)
    ) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;

        this.createSprite();

        parent.addChild(this.container);
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
        this.container.position.set(this.position.x, this.position.y);
        this.container.rotation = this.rotation * (Math.PI / 180);
        // this.container.scale.set(this.scale.x, this.scale.y);
    }

    /**
     * Gets the game object's container for adding child display objects.
     * @returns The PIXI.Container associated with this game object.
     */
    getContainer(): Container {
        return this.container;
    }

    destroy(): void {
        this.container.destroy({ children: true });
    }
}