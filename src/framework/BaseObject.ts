import { GameRoot } from "framework";
import { Container } from "pixi.js";

export abstract class BaseObject{
    // Settings basically
    public abstract get Name(): string;
    public get layer(): string { return "default"; }
    public get isUI(): boolean { return false; }

    protected parent: BaseObject | GameRoot;
    protected root: GameRoot;
    private children: BaseObject[] = [];

    private container: Container = new Container();

    private destroyed: boolean = false;

    constructor(
        parent: BaseObject | GameRoot,
        root: GameRoot,
    ) {
        this.parent = parent;
        this.root = root;

        this.parent.addChild(this);

        this.setUpContainer();
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
     * Adds a child game object to this game object.
     * @param child The child game object to add.
     */
    public addChild(child: BaseObject): void {
        this.children.push(child);
    }

    public getChildrenByName(string: string): BaseObject[] {
        return this.children.filter((child) => child.Name === string);
    }

    public removeChild(child: BaseObject): void {
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

        // Destroy graphics container
        this.container.destroy({ children: true });

        // Mark as destroyed
        this.destroyed = true;
    }
}