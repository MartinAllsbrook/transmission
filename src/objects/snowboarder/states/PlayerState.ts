import { Body } from "../Body.ts";
import { Head } from "../Head.ts";
import { Snowboard } from "../Snowboard.ts";
import { Snowboarder } from "../Snowboarder.ts";
import { TricksManager } from "../TricksManager.ts";

export abstract class PlayerState {
    protected player: Snowboarder;
    protected body: Body;
    protected head: Head;
    protected board: Snowboard;
    protected tricksManager: TricksManager;


    constructor(
        snowboarder: Snowboarder, 
        body: Body, 
        head: Head, 
        board: Snowboard,
        tricksManager: TricksManager,
    ) {
        this.player = snowboarder;
        this.body = body;
        this.head = head;
        this.board = board;
        this.tricksManager = tricksManager;
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