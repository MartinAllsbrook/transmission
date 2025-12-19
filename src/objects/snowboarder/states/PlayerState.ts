import { SATCollider, Vector2D } from "framework";
import { Body } from "../Body.ts";
import { Head } from "../Head.ts";
import { Snowboard } from "../Snowboard.ts";
import { PlayerConfig, PlayerInputs, Snowboarder } from "../Snowboarder.ts";
import { TricksManager } from "../TricksManager.ts";

export type StateName = "ground" | "air" | "rail";

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
    shiftyAngle: number;
    shiftyTargetAngle: number;
    velocity: Vector2D;
    deltaRotation: number;
    deltaHeight: number;
}

export abstract class PlayerState {
    protected player: Snowboarder;
    protected body: Body;
    protected head: Head;
    protected board: Snowboard;
    protected tricksManager: TricksManager;
    protected inputs: PlayerInputs;
    protected config: PlayerConfig;

    protected velocity: Vector2D;
    protected shiftyAngle: number;
    protected shiftyTargetAngle: number;
    protected deltaHeight: number;
    protected deltaRotation: number;

    constructor(snowboarderInfo: SnowboarderInfo, sharedStateData?: SharedStateData) {
        this.player = snowboarderInfo.player;
        this.body = snowboarderInfo.body;
        this.head = snowboarderInfo.head;
        this.board = snowboarderInfo.board;
        this.tricksManager = snowboarderInfo.tricksManager;
        this.inputs = snowboarderInfo.inputs;
        this.config = snowboarderInfo.config;

        if (!sharedStateData) {
            sharedStateData = {
                velocity: new Vector2D(0, 0),
                shiftyAngle: 0,
                shiftyTargetAngle: 0,
                deltaHeight: 0,
                deltaRotation: 0,
            }
        }

        this.velocity = sharedStateData.velocity;
        this.shiftyAngle = sharedStateData.shiftyAngle;
        this.shiftyTargetAngle = sharedStateData.shiftyTargetAngle;
        this.deltaHeight = sharedStateData.deltaHeight;
        this.deltaRotation = sharedStateData.deltaRotation;
    }

    public abstract enter(): void;
    
    public update(deltaTime: number): void {
        this.shiftyUpdate(deltaTime);
        this.physicsUpdate(deltaTime);

        const newState = this.checkTransitions();
        if (newState) this.player.State = newState;
        
    }
    
    protected abstract shiftyUpdate(deltaTime: number): void
    
    protected abstract physicsUpdate(deltaTime: number): void 
    
    protected abstract checkTransitions(): StateName | void;

    public onCollisionEnter(_other: SATCollider): void {}

    public onCollisionStay(_other: SATCollider): void {}

    public onCollisionExit(_other: SATCollider): void {}

    public exit(): SharedStateData {
        return this.getSharedStateData();
    }

    protected getSharedStateData(): SharedStateData {
        return {
            velocity: this.velocity.clone(), // Not sure if this clone is necessary but just in case
            shiftyAngle: this.shiftyAngle,
            shiftyTargetAngle: this.shiftyTargetAngle,
            deltaHeight: this.deltaHeight,
            deltaRotation: this.deltaRotation,
        };
    }

    public get Velocity(): Vector2D {
        return this.velocity;
    }

    public abstract get StateName(): StateName;
}