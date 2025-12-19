import { GameObject, Parent } from "../../framework/GameObject.ts";
import { Vector2D, LayerManager, SATCollider, InputManager } from "framework";

import { Snowboard } from "./Snowboard.ts";
import { Body } from "./Body.ts";
import { Shadow } from "./Shadow.ts";
import { TricksManager } from "./TricksManager.ts";
import { PlayerState, StateName } from "./states/PlayerState.ts";
import { GroundState } from "./states/GroundState.ts";
import { AirState } from "./states/AirState.ts";
import { RailState } from "./states/RailState.ts";
import { LandingParticles } from "./particles/LandingParticles.ts";
  
export interface PlayerConfig {
    // Initialization
    startPosition: Vector2D;

    // 2D Physics
    frictionStrength: number;
    gravityStrength: number;
    slipStrength: number;
    
    // Rotation
    rotationSpeed: number;
    rotationStrength: number;

    // Height & Air
    gravityHeightStrength: number;
    jumpStrength: number;

    // Shifty
    shiftyLerpSpeed: number;
    shiftyMaxAngle: number;

    // Rail
    railCorrectionStrength: number;
}

export class PlayerInputs {
    turn: number = 0; // -1 to 1
    jump: boolean = false;
    shifty: number = 0; // -1 to 1
}

export class Snowboarder extends GameObject {
    private readonly config: PlayerConfig = {
        startPosition: new Vector2D(128, 128),

        frictionStrength: 0.1, // Raising this lowers top speed (max 1)
        gravityStrength: 140, // Raising this value makes the game feel faster
        slipStrength: 325, // Raising this value makes turning more responsive
        
        rotationSpeed: 250,
        rotationStrength: 10,

        gravityHeightStrength: 16,
        jumpStrength: 4,

        shiftyLerpSpeed: 3, // Higher is snappier
        shiftyMaxAngle: 90, // Degrees

        railCorrectionStrength: 2, // Higher is more corrective
    };

    private inputs: PlayerInputs = {
        turn: 0,
        jump: false,
        shifty: 0,
    }

    private state: PlayerState;
        
    private physicalPosition: Vector2D = this.config.startPosition.clone();
    private height: number = 0;

    // Components
    private shadow: Shadow;
    private snowboard: Snowboard;
    private body: Body;
    private tricksManager: TricksManager;

    constructor(parent: Parent) {
        super(parent);

        this.shadow = new Shadow(parent);
        this.snowboard = new Snowboard(this);
        this.body = new Body(this);

        this.setupInputs();

        LayerManager.getLayer("snowboarder")?.attach(this.container);
        this.tricksManager = new TricksManager(this);

        this.state = new GroundState({
            player: this,
            body: this.body,
            head: this.body.Head,
            board: this.snowboard,
            tricksManager: this.tricksManager,
            inputs: this.inputs,
            config: this.config,
        });

        const landingParticles = new LandingParticles(this);
        
        setTimeout(() => {
            landingParticles.playParticles(4);
        }, 2000);

        this.state.enter();
    }

    // #region Miscellaneous

    private setupInputs() {
        InputManager.getInput("turn").subscribe((newValue) => {
            this.inputs.turn = newValue;
        });

        InputManager.getInput("jump").subscribe((newValue) => {
            this.inputs.jump = newValue;
        });

        InputManager.getInput("shifty").subscribe((newValue) => {
            this.inputs.shifty = newValue;
        });
    }

    public reset() {
        this.physicalPosition.set(new Vector2D(128, 128));
        this.rotation = 0;
        this.height = 0;

        this.state = new GroundState({
            player: this,
            body: this.body,
            head: this.body.Head,
            board: this.snowboard,
            tricksManager: this.tricksManager,
            inputs: this.inputs,
            config: this.config,
        });

        this.state.enter();

        this.tricksManager.reset();
    }

    // #endregion

    // #region Collisions

    public onCollisionEnter(other: SATCollider): void {
        this.state.onCollisionEnter(other);
    }

    public onCollisionStay(other: SATCollider): void {
        this.state.onCollisionStay(other);
    }

    public onCollisionExit(other: SATCollider): void {
        this.state.onCollisionExit(other);
    }

    // #endregion

    // #region Update

    public override update(deltaTime: number): void {
        this.state.update(deltaTime);

        this.scale = new Vector2D(1 + this.height * 0.15, 1 + this.height * 0.15);
        this.shadow.setEffects(this.height, this.snowboard.WorldRotation);

        super.update(deltaTime);
    }

    // #endregion

    // #region Getters & Setters

    public override get WorldPosition(): Vector2D {
        return this.physicalPosition.clone();
    }

    public get PhysicalPosition(): Vector2D {
        return this.physicalPosition;
    }

    public get Height(): number {
        return this.height;
    }

    public set Height(value: number) {
        this.height = value;
    }

    public get Velocity(): Vector2D {
        return this.state.Velocity;
    }

    public set State(newState: StateName) {
        switch (newState) {
            case "ground":
                this.state = new GroundState({
                    player: this,
                    body: this.body,
                    head: this.body.Head,
                    board: this.snowboard,
                    tricksManager: this.tricksManager,
                    inputs: this.inputs,
                    config: this.config,
                }, this.state.exit());
                this.state.enter();
                break;
            case "air":
                this.state = new AirState({
                    player: this,
                    body: this.body,
                    head: this.body.Head,
                    board: this.snowboard,
                    tricksManager: this.tricksManager,
                    inputs: this.inputs,
                    config: this.config,
                }, this.state.exit());
                this.state.enter();
                break;
            case "rail":
                this.state = new RailState({
                    player: this,
                    body: this.body,
                    head: this.body.Head,
                    board: this.snowboard,
                    tricksManager: this.tricksManager,
                    inputs: this.inputs,
                    config: this.config,
                }, this.state.exit());
                this.state.enter();
                break;
            default:
                throw new Error(`Unknown state: ${newState}`);
        }
    }

    public get StateName(): StateName {
        return this.state.StateName;
    }

    // #endregion
}
