import { Snowboarder } from "../Snowboarder.ts";

export abstract class State {
    protected snowboarder: Snowboarder;

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