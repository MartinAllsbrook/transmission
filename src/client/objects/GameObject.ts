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

        parent.addChild(this.container);
    }

    /**
     * Method to update the game object each frame. Called with the time delta since the last frame.
     * @param deltaTime Time in milliseconds since the last frame.
     */
    abstract update(deltaTime: number): void;

    /**
     * Gets the game object's container for adding child display objects.
     * @returns The PIXI.Container associated with this game object.
     */
    getContainer(): Container {
        return this.container;
    }
}