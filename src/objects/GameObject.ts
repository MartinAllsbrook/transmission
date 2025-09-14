import { Application, Assets, Container, Sprite } from "pixi.js";
import { Vector2D } from "src/math/Vector2D.ts";
import { SATCollider } from "../colliders/SATCollider.ts";

export type Parent = Application | GameObject;

/**
 * Base class for all game objects in the game.
 */
export abstract class GameObject {
    protected position: Vector2D;
    protected rotation: number;
    scale: Vector2D;

    parent: GameObject | null = null;
    children: GameObject[] = [];
    container: Container = new Container();

    onSpriteLoaded: (() => void)[] = [];

    private colliders: SATCollider[] = [];

    private autoCenter: boolean = true;

    constructor(
        parent: Parent,
        position: Vector2D = new Vector2D(0, 0),
        rotation: number = 0,
        scale: Vector2D = new Vector2D(1, 1),
    ) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;

        if (parent instanceof GameObject) {
            parent.addChild(this);
            this.parent = parent;
        } else if (parent instanceof Application) {
            parent.stage.addChild(this.container);
        } else {
            throw new Error("Invalid parent type");
        }

        this.syncTransform();
    }

    public set AutoCenter(value: boolean) {
        this.autoCenter = value;
    }

    public async createSprite() {
        await Promise.resolve(); // Ensure async context

        // if (this.autoCenter) {
        //     this.container.pivot.x = this.container.width / 2;
        //     this.container.pivot.y = this.container.height / 2;
        // }

        this.container.position.set(this.position.x, this.position.y);
        this.container.rotation = this.rotation * (Math.PI / 180);

        this.container.scale.set(this.scale.x, this.scale.y);

        for (const child of this.children) {
            await child.createSprite();
        }

        this.onSpriteLoaded.forEach((callback) => callback());
    }

    protected async loadSprite(url: string, scale: number = 1): Promise<Sprite> {
        const texture = await Assets.load(url);
        texture.source.scaleMode = "nearest";
        const sprite = new Sprite(texture);
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(scale, scale);
        this.container.addChild(sprite);
        return sprite;
    }

    /**
     * Method to update the game object each frame. Called with the time delta since the last frame.
     * @param deltaTime Time in milliseconds since the last frame.
     */
    public update(_deltaTime: number): void {

        this.syncTransform();
        this.children.forEach((child) => child.update(_deltaTime));
    }

    /**
     * Updates the container's position, rotation, and scale to match the game object's properties.
     */
    private syncTransform() {
        this.container.position.set(this.position.x, this.position.y);
        this.container.rotation = this.rotation * (Math.PI / 180);
        // this.container.scale.set(this.scale.x, this.scale.y);
    }

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
        return this.position.clone();
    }

    /**
     * This object's position in world coordinates.
     */
    get WorldPosition(): Vector2D {
        if (this.parent) {
            return this.parent.WorldPosition.add(this.position);
        } else {
            return this.Position;
        }
    }

    /**
     * This object's position in world coordinates.
     */
    get ScreenPosition(): Vector2D {
        if (this.parent) {
            return this.parent.ScreenPosition.add(this.position);
        } else {
            return this.Position;
        }
    }

    /**
     * This object's rotation in degrees.
     */
    get Rotation(): number {
        return this.rotation;
    }

    /**
     * This object's rotation in world coordinates.
     */
    get WorldRotation(): number {
        if (this.parent) {
            return this.parent.WorldRotation + this.rotation;
        } else {
            return this.rotation;
        }
    }

    /**
     * Sets this object's rotation relative to the world.
     */
    set WorldRotation(value: number) {
        if (this.parent) {
            this.rotation = value - this.parent.WorldRotation;
        } else {
            this.rotation = value;
        }
        this.syncTransform();
    }
}
