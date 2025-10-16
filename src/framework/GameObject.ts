import { Application, Assets, Container, Sprite } from "pixi.js";
import { Vector2D } from "src/math/Vector2D.ts";
import { SATCollider } from "../colliders/SATCollider.ts";
import { LayerManager } from "../rendering/LayerManager.ts";

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
    private spriteCreated: boolean = false;

    private autoCenter: boolean = true;

    private destroyed: boolean = false;

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

        // Schedule createSprite() to run after all constructors in the chain have completed
        // This ensures subclass constructors have finished setting up before createOwnSprites() is called
        queueMicrotask(() => {
            this.createSprite();
        });
    }

    public set AutoCenter(value: boolean) {
        this.autoCenter = value;
    }

    public async createSprite() {
        // Prevent duplicate calls
        if (this.spriteCreated) return;
        this.spriteCreated = true;

        await Promise.resolve(); // Ensure async context

        this.container.position.set(this.position.x, this.position.y);
        this.container.scale.set(this.scale.x, this.scale.y);

        // First, create this object's own sprites (they will render behind children)
        await this.createOwnSprites();

        // Then, add child containers to the hierarchy (they will render in front of this object's sprites)
        // Note: Children that were created before this point will have their containers added here
        for (const child of this.children) {
            if (!this.container.children.includes(child.container)) {
                this.container.addChild(child.container);
            }
        }

        // Children created after this point will automatically have createSprite() called via queueMicrotask
        // No need to recursively call createSprite() on existing children since they handle themselves

        this.onSpriteLoaded.forEach((callback) => callback());
    }

    /**
     * Override this method in subclasses to create the object's own sprites.
     * This is called before child containers are added, ensuring proper render order.
     */
    protected async createOwnSprites(): Promise<void> {
        // Base implementation does nothing - subclasses should override this
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
        this.children.forEach((child) => child.update(_deltaTime));
    }

    /**
     * Updates the container's position, rotation, and scale to match the game object's properties.
     */
    private syncTransform() {
        this.container.position.set(this.position.x, this.position.y);
        this.container.rotation = this.rotation * (Math.PI / 180);
        this.container.scale.set(this.scale.x, this.scale.y);
    }

    /**
     * Adds a child game object to this game object.
     * Note: Child containers are added to the display hierarchy during createSprite() to ensure proper render order.
     * @param child The child game object to add.
     */
    public addChild(child: GameObject): void {
        this.children.push(child);
        
        // If this parent has already had createSprite() called, immediately add the child's container
        // Otherwise, it will be added when this parent's createSprite() is called
        if (this.spriteCreated && !this.container.children.includes(child.container)) {
            this.container.addChild(child.container);
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

        // Mark as destroyed
        this.destroyed = true;
    }

    public get Destroyed(): boolean {
        return this.destroyed;
    }

    /**
     * This object's position relative to its parent.
     */
    get Position(): Vector2D {
        return this.position.clone();
    }

    /**
     * Sets this object's position relative to its parent.
     */
    set Position(value: Vector2D) {
        this.position = value.clone();
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
     * Sets this object's position in world coordinates.
     */
    set WorldPosition(value: Vector2D) {
        if (this.parent) {
            this.position = value.subtract(this.parent.WorldPosition);
        } else {
            this.position = value.clone();
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
     * This object's local rotation in degrees.
     */
    get Rotation(): number {
        return this.rotation;
    }

    /**
     * Sets this object's local rotation in degrees.
     */
    set Rotation(value: number) {
        this.rotation = value;
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
