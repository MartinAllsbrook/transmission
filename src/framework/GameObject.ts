import { Assets, Container, Sprite } from "pixi.js";
import { Vector2D } from "./math/Vector2D.ts";
import { SATCollider } from "./colliders/SATCollider.ts";
import { LayerManager } from "./rendering/LayerManager.ts";
import { Transform, TransformOptions } from "./Transform.ts";
import { GameRoot } from "./GameRoot.ts";

/**
 * Base class for all game objects in the game.
 */
export abstract class GameObject {
    private parent: GameObject | GameRoot;
    private root: GameRoot;
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
        this.parent.addChild(this);
        this.transform = new Transform(parent.Transform, transformOptions);

        this.root = root;
        this.root.addContainer(this.container);

        this.syncTransform();

        this.Start();
    }

    protected Start(): void {
        // To be optionally overridden by subclasses
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
        
        // Z-Index
        if (options.zIndex !== undefined)
            sprite.zIndex = options.zIndex;

        if (options.makeChild === undefined || options.makeChild)
            this.container.addChild(sprite);

        return sprite;
    }

    /**
     * Method to update the game object each frame. Called with the time delta since the last frame.
     * @param deltaTime Time in milliseconds since the last frame.
     */
    public update(_deltaTime: number): void {
        this.syncTransform();

        for (const child of this.children) {
            child.update(_deltaTime);
        }
    }

    /**
     * Updates the container's position, rotation, and scale to match the game object's properties.
     */
    private syncTransform() {
        this.container.position.set(
            this.transform.WorldPosition.x, 
            this.transform.WorldPosition.y
        );
        this.container.rotation = this.transform.Rotation;
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
        
        // // If this parent has already had createSprite() called, immediately add the child's container
        // // Otherwise, it will be added when this parent's createSprite() is called
        // if (this.spriteCreated && !this.container.children.includes(child.container)) {
        //     this.container.addChild(child.container);
        // }
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

    public get Destroyed(): boolean {
        return this.destroyed;
    }

    public get Transform(): Transform {
        return this.transform;
    }
}
