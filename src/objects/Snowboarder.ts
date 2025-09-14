import { Assets, Sprite } from "pixi.js";
import { GameObject, Parent } from "./GameObject.ts";
import { RectCollider } from "../colliders/RectCollider.ts";
import { Vector2D } from "../math/Vector2D.ts";
import { SnowboarderTrail } from "./SnowbarderTrail.ts";
import Game from "islands/Game.tsx";
import { LayerManager } from "../rendering/LayerManager.ts";
import { StatTracker } from "../scoring/StatTracker.ts";
import { TextManager } from "../scoring/TextManager.ts";

export class Snowboarder extends GameObject {
    private turnInput: number = 0;
    private jumpInput: boolean = false;

    /** The position of the player in the world, used for world scrolling */
    public worldPosition: Vector2D = new Vector2D(128, 128);

    /** A set of stats to be acessed by the game UI */
    private stats: {
        speed: StatTracker;
        distance: StatTracker;
        score: StatTracker;
    };

    /** The current velocity of the player */
    private velocity: Vector2D = new Vector2D(0, 0);

    private rotationRate: number = 0;

    private inAir = false;
    private height: number = 0;

    private timeGoingFast: number = 0; 

    constructor(parent: Parent, stats: {
        speed: StatTracker;
        distance: StatTracker;
        score: StatTracker;
    }) {
        super(parent);

        this.stats = stats;

        this.setupInputs();

        LayerManager.getLayer("foreground")?.attach(this.container);
    }

    private async setupInputs() {
        const { InputManager } = await import("src/inputs/InputManager.ts");

        InputManager.getInput("turn").subscribe((newValue) => {
            this.turnInput = newValue;
        });

        InputManager.getInput("jump").subscribe((newValue) => {
            this.jumpInput = newValue;
        });
    }

    public override async createSprite() {
        const headTexture = await Assets.load("/snowboarder/Head.png");
        headTexture.source.scaleMode = "nearest";
        const headSprite = new Sprite(headTexture);

        const bodyTexture = await Assets.load("/snowboarder/Body.png");
        bodyTexture.source.scaleMode = "nearest";
        const bodySprite = new Sprite(bodyTexture);

        const boardTexture = await Assets.load("/snowboarder/Board.png");
        boardTexture.source.scaleMode = "nearest";
        const boardSprite = new Sprite(boardTexture);

        this.container.addChild(boardSprite);
        this.container.addChild(bodySprite);
        this.container.addChild(headSprite);

        await super.createSprite();
        this.setupCollider();
    }

    private setupCollider() {
        const collider = new RectCollider(
            this,
            new Vector2D(0, 0),
            new Vector2D(32, 7),
            true,
            "player",
        );

        collider.onCollisionStart((other) => {
            if (other.layer === "obstacle") {
                if (this.velocity.magnitude() > 10) {
                    Game.endGame();
                }
                
                this.velocity = this.velocity.multiply(-0.5);
            }
            if (other.layer === "jump" && !this.inAir) {
                this.height += 1;
            }
        });

        collider.onCollisionEnd((other) => {
            if (other.layer === "jump" && !this.inAir) {
                this.inAir = true;
            }
        });
    }

    public override update(deltaTime: number): void {

        // TODOs:
            // - Snowboarder scaling on jump
            // - Gain height the longer you're on a jump
            // - Add shifties to control air rotation
            // - Add points
            // - Add some momentum upwards when hitting a jump at speed

        if (this.jumpInput && !this.inAir) {
            this.height += 0.5;
            this.inAir = true;
        };

        this.updatePhysics(deltaTime);

        this.updateStats();
        this.updateTrail();


        const speed = this.velocity.magnitude();
        if (speed > 300) {
            this.timeGoingFast += deltaTime;
            console.log(this.timeGoingFast);
        } else if (this.timeGoingFast > 2) {
            const points = Math.floor(this.timeGoingFast * 10);
            this.addScore(points);
            this.timeGoingFast = 0;
        }

        super.update(deltaTime);
    }

    private updateTrail() {
        if (this.inAir) return;

        SnowboarderTrail.instance?.addTrailPoint(
            this.worldPosition,
            Vector2D.fromAngle(this.rotation * (Math.PI / 180) - Math.PI / 2),
        );
    }

    // #region Scoring & Stats

    private updateStats() {
        const { speed, distance } = this.stats;

        speed.Value = this.velocity.magnitude();
        distance.Value = this.worldPosition.y;
    }

    private addScore(points: number) {
        this.stats.score.Value += points;

        TextManager.createScoreFadeoutText(points);
    }

    // #endregion

    // #region Physics and Movement

    private updatePhysics(deltaTime: number) {
        const turnStrength = 250;

        if (this.inAir) {
            this.height -= deltaTime;
            if (this.height <= 0) {
                this.height = 0;
                this.inAir = false;
            }
        } else {
            const frictionStrength = 0.1; // Raising this lowers top speed (max 1)
            const gravityStrength = 140; // Raising this value makes the game feel faster
            const slipStrength = 325; // Raising this value makes turning more responsive
    
            // Apply gravity
            this.velocity.y += gravityStrength * deltaTime;
    
            // Rotate
            this.rotationRate += (this.turnInput - this.rotationRate) * deltaTime * 10;
            
            const radians = (this.rotation) * (Math.PI / 180);
    
            // Normal force
            const forward = Vector2D.fromAngle(radians - Math.PI / 2);
            const direction = this.velocity.normalize();
            const projected = direction.projectOnto(forward);
            const normal = projected.subtract(direction);
    
            const strength = Math.pow((1 - normal.magnitude()), 2) * 0.25 + 1;
            const normalDirection = projected.subtract(direction).normalize().multiply(strength);
    
            this.velocity = this.velocity.add(normalDirection.multiply(deltaTime * slipStrength));
    
            // Friction
            this.velocity = this.velocity.multiply(
                1 - frictionStrength * deltaTime,
            );
        }

        this.rotation += this.rotationRate * deltaTime * turnStrength;

        // Update position
        this.worldPosition.set(
            this.worldPosition.add(this.velocity.multiply(deltaTime)),
        );
    }

    // #endregion

    public reset() {
        this.worldPosition.set(new Vector2D(128, 128));
        this.velocity.set(new Vector2D(0, 0));
        this.rotation = 0;
    }
}
