import { Snowboarder } from "../Snowboarder.ts";
import { TricksManager } from "../TricksManager.ts";

export abstract class State {
    protected snowboarder: Snowboarder;
    protected tricksManager: TricksManager;


    constructor(snowboarder: Snowboarder) {
        this.snowboarder = snowboarder;
    }

    public abstract enter(): void;
    
    public update(deltaTime: number): void {
        this.shiftyUpdate(deltaTime);
        this.physicsUpdate(deltaTime);
    }

    public abstract exit(): void;

    protected abstract shiftyUpdate(deltaTime: number): void

    protected abstract physicsUpdate(deltaTime: number): void 
}