import { Assets, Container, Sprite } from "pixi.js";
import { Vector2D } from "./math/Vector2D.ts";
import { SATCollider } from "./colliders/SATCollider.ts";
import { LayerManager } from "./rendering/LayerManager.ts";
import { Transform, TransformOptions } from "./Transform.ts";
import { GameRoot } from "./GameRoot.ts";
import { CircleCollider, RectCollider } from "framework";
import { RectColliderOptions } from "./colliders/RectCollider.ts";
import { CircleColliderOptions } from "./colliders/CircleCollider.ts";

/**
 * Base class for all game objects in the game.
 */
export abstract class GameObject {
    // Settings basically
    public abstract get Name(): string;
    public get layer(): string { return "default"; }
    public get isUI(): boolean { return false; }

    protected parent: GameObject | GameRoot;
    protected root: GameRoot;
    private children: GameObject[] = [];

    private transform: Transform;
    private container: Container = new Container();

    private colliders: SATCollider[] = [];
    private sprites: Sprite[] = [];

    private destroyed: boolean = false;

    constructor(
        parent: GameObject | GameRoot,
        root: GameRoot,
        transformOptions?: TransformOptions
    ) {
        this.parent = parent;
        this.root = root;

        this.parent.addChild(this);
        this.transform = new Transform(parent.Transform, transformOptions);

        this.setUpContainer();
        this.syncTransform();
        queueMicrotask(() => this.start());
    }

    private setUpContainer(): void {
        this.container.label = this.Name;
        this.root.addContainer(this.container, this.isUI);
    }

    protected start(): void {}

    public baseUpdate(deltaTime: number): void {
        this.update(deltaTime);
        
        for (const child of this.children) {
            child.baseUpdate(deltaTime);
        }
        
        this.syncTransform();
    }

    /**
     * Method to update the game object each frame. Called with the time delta since the last frame.
     * @param deltaTime Time in milliseconds since the last frame.
     */
    protected update(_deltaTime: number): void {}


    public baseReset(): void {
        this.reset();

        for (const child of this.children) {
            child.baseReset();
        }
    }

    /**
     * Resets the game object to its initial state. Called when the game is reset.
     */
    protected reset(): void {}

    /**
     * Updates the container's position, rotation, and scale to match the game object's properties.
     */
    private syncTransform() {
        this.container.position.set(
            this.transform.WorldPosition.x, 
            this.transform.WorldPosition.y
        );
        this.container.rotation = this.transform.WorldRotation;
        this.container.scale.set(
            this.transform.WorldScale.x, 
            this.transform.WorldScale.y
        );
    }

    /**
     * Adds a child game object to this game object.
     * @param child The child game object to add.
     */
    public addChild(child: GameObject): void {
        this.children.push(child);
    }

    public getChildrenByName(string: string): GameObject[] {
        return this.children.filter((child) => child.Name === string);
    }

    public removeChild(child: GameObject): void {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        } else {
            console.warn("Attempted to remove a child that does not exist on this parent.");
        }
    }

    /**
     * Destroys the game object, its children, and associated resources.
     */
    public destroy(): void {
        // Remove from parent's children array
        this.parent.removeChild(this);

        // Destroy all children
        const childrenCopy = [...this.children];
        childrenCopy.forEach((child) => child.destroy());

        // Destroy all colliders
        this.colliders.forEach((collider) => collider.destroy());
        this.colliders = [];

        // Destroy graphics container
        this.container.destroy({ children: true });

        // Mark as destroyed
        this.destroyed = true;
    }

    protected async loadSprite(url: string, options?: {
        scale?: Vector2D;
        rotation?: number;
        anchor?: Vector2D;
        scaleMode?: "nearest" | "linear";
        position?: Vector2D;
        layer?: string;
        zIndex?: number;
        makeChild?: boolean;
    }): Promise<Sprite> {
        if (options === undefined) options = {};
        
        const texture = await Assets.load(url);
        texture.source.scaleMode = options.scaleMode ? options.scaleMode : "nearest";

        const sprite = new Sprite(texture);
        
        // Anchor point
        if (options.anchor) 
            sprite.anchor.set(options.anchor.x, options.anchor.y);
        else 
            sprite.anchor.set(0.5, 0.5);
        
        // Scale
        if (options.scale)
            sprite.scale.set(options.scale.x, options.scale.y);
        
        // Rotation
        if (options.rotation)
            sprite.rotation = options.rotation * (Math.PI / 180);

        // Position
        if (options.position)
            sprite.position.set(options.position.x, options.position.y);

        // Layer
        if (options.layer) 
            LayerManager.getLayer(options.layer)?.attach(sprite);
        else 
            LayerManager.getLayer(this.layer)?.attach(sprite);
        
        // Z-Index
        if (options.zIndex !== undefined)
            sprite.zIndex = options.zIndex;

        if (options.makeChild === undefined || options.makeChild)
            this.container.addChild(sprite);

        return sprite;
    }

    addGraphics(graphics: Container, options?: {
        layer?: string,
    }): void {
        if (options === undefined) options = {};

        // Layer
        if (options.layer) 
            LayerManager.getLayer(options.layer)?.attach(graphics);
        else 
            LayerManager.getLayer(this.layer)?.attach(graphics);

        this.container.addChild(graphics);
    }

    /**
     * Adds a collider to this game object. (Used in collider constructors)
     * @param collider The collider to add to this game object.
     */
    public addCollider(collider: SATCollider): void {
        this.colliders.push(collider);
    }

    //#region Component Factories

    createRectCollider(options?: RectColliderOptions): RectCollider {
        const collider = new RectCollider(this, options);
        this.colliders.push(collider);
        return collider;
    }

    createCircleCollider(opitions?: CircleColliderOptions): CircleCollider {
        const collider = new CircleCollider(this, opitions);
        this.colliders.push(collider);
        return collider;
    }

    //#endregion

    //#region Getters / Setters

    /**
     * Whether or not this game object has been destroyed.
     */
    public get Destroyed(): boolean {
        return this.destroyed;
    }

    /**
     * The transform of this game object.
     */
    public get Transform(): Transform {
        return this.transform;
    }

    /**
     * The root of the game object hierarchy.
     * Mainly used for debugging purposes?
     */
    public get Root(): GameRoot {
        return this.root;
    }

    //#endregion
}
