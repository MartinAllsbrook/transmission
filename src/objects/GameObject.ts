import { Application, Container } from "pixi.js";
import { Vector2D } from "src/math/Vector2D.ts";
import { SATCollider } from "../colliders/SATCollider.ts";

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

    private colliders: SATCollider[] = [];

    constructor(
        parent: Parent,
        position: Vector2D = new Vector2D(0, 0),
        size: Vector2D = new Vector2D(0, 0),
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

    // /**
    //  * Adds visual elements (like sprites or graphics) directly to the game object's PIXI container.
    //  */
    // public addVisual(child: Container): void {
    //     this.container.addChild(child);
    //     child.position.set(this.container.pivot.x, this.container.pivot.y);
    // }

    /**
     * Adds a child game object to this game object.
     * @param child The child game object to add.
     */
    public addChild(child: GameObject): void {
        this.children.push(child);
        this.container.addChild(child.container);
    }

    /**
     * Adds a collider to this game object.
     * @param collider The collider to add to this game object.
     */
    public addCollider(collider: SATCollider): void {
        this.colliders.push(collider);
    }

    /**
     * Destroys the game object, its children, and associated resources.
     */
    public destroy(): void {
        // Remove from parent's children array
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index > -1) {
                this.parent.children.splice(index, 1);
            }
        }

        // Destroy all children
        const childrenCopy = [...this.children];
        childrenCopy.forEach((child) => child.destroy());

        // Destroy all colliders
        this.colliders.forEach((collider) => collider.destroy());
        this.colliders = [];

        // Destroy graphics container
        this.container.destroy({ children: true });
    }
    /**
     * This object's position relative to its parent.
     */
    get Position(): Vector2D {
        return this.position;
    }

    /**
     * This object's position in world coordinates.
     */
    get WorldPosition(): Vector2D {
        if (this.parent) {
            return this.parent.WorldPosition.add(this.position);
        } else {
            return this.position;
        }
    }
}
