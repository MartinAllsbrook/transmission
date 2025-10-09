import { Body } from "../Body.ts";
import { Head } from "../Head.ts";
import { Snowboard } from "../Snowboard.ts";
import { PlayerConfig, PlayerInputs, Snowboarder } from "../Snowboarder.ts";
import { TricksManager } from "../TricksManager.ts";

export interface SnowboarderInfo {
    player: Snowboarder, 
    body: Body, 
    head: Head, 
    board: Snowboard,
    tricksManager: TricksManager,
    inputs: PlayerInputs,
    config: PlayerConfig
}

export interface SharedStateData {
    shiftyAngle?: number;
    shiftyTargetAngle?: number;
    rotationRate?: number;
    deltaHeight?: number;
    height?: number;
}

export abstract class PlayerState {
    protected player: Snowboarder;
    protected body: Body;
    protected head: Head;
    protected board: Snowboard;
    protected tricksManager: TricksManager;
    protected inputs: PlayerInputs;
    protected config: PlayerConfig;

    protected sharedStateData: SharedStateData;

    constructor(snowboarderInfo: SnowboarderInfo, sharedStateData: SharedStateData) {
        this.player = snowboarderInfo.player ;
        this.body = snowboarderInfo.body;
        this.head = snowboarderInfo.head;
        this.board = snowboarderInfo.board;
        this.tricksManager = snowboarderInfo.tricksManager;
        this.inputs = snowboarderInfo.inputs;
        this.config = snowboarderInfo.config;

        this.sharedStateData = sharedStateData;

        this.enter();
    }

    public abstract enter(): void;
    
    public update(deltaTime: number): void {
        this.shiftyUpdate(deltaTime);
        this.physicsUpdate(deltaTime);
    }

    public exit(): SharedStateData {
        return this.getSharedStateData();
    }

    protected abstract shiftyUpdate(deltaTime: number): void

    protected abstract physicsUpdate(deltaTime: number): void 

    protected abstract getSharedStateData(): SharedStateData
}