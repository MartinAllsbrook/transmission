import { Inputs, Settings, Snowboarder, StateData } from "../Snowboarder.ts";
import { TricksManager } from "../TricksManager.ts";

export abstract class State {
    protected snowboarder: Snowboarder;
    protected tricksManager: TricksManager;
    protected input: Inputs;
    protected settings: Settings;
    protected data: StateData;

    constructor(
        snowboarder: Snowboarder, 
        tricksManager: TricksManager,
        input: Inputs,
        settings: Settings,
        data: StateData,
    ) {
        this.snowboarder = snowboarder;
        this.tricksManager = tricksManager;
        this.input = input;
        this.settings = settings;
        this.data = data;

        this.enter();
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