import { Body } from "../Body.ts";
import { Head } from "../Head.ts";
import { Snowboard } from "../Snowboard.ts";
import { PlayerConfig, PlayerInputs, Snowboarder } from "../Snowboarder.ts";
import { TricksManager } from "../TricksManager.ts";

export abstract class PlayerState {
    protected player: Snowboarder;
    protected body: Body;
    protected head: Head;
    protected board: Snowboard;
    protected tricksManager: TricksManager;
    protected inputs: PlayerInputs;
    protected config: PlayerConfig;

    constructor(
        snowboarder: Snowboarder, 
        body: Body, 
        head: Head, 
        board: Snowboard,
        tricksManager: TricksManager,
        inputs: PlayerInputs,
        config: PlayerConfig,
    ) {
        this.player = snowboarder;
        this.body = body;
        this.head = head;
        this.board = board;
        this.tricksManager = tricksManager;
        this.inputs = inputs;
        this.config = config;

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