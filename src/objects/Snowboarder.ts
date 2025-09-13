import { Assets, Sprite } from "pixi.js";
import { GameObject, Parent } from "./GameObject.ts";
import { RectCollider } from "../colliders/RectCollider.ts";
import { Vector2D } from "../math/Vector2D.ts";
import { Signal } from "@preact/signals";
import { SnowboarderTrail } from "./SnowbarderTrail.ts";
import Game from "islands/Game.tsx";
import { LayerManager } from "../rendering/LayerManager.ts";

export class Snowboarder extends GameObject {
    /** Input value for turning, from -1 to 1 */
    private turnInput: number = 0;

    /** The position of the player in the world, used for world scrolling */
    public worldPosition: Vector2D = new Vector2D(128, 128);

    /** A set of stats to be acessed by the game UI */
    private stats: {
        speed: Signal<number>;
        distance: Signal<number>;
        score: Signal<number>;
    };

    /** The current velocity of the player */
    private velocity: Vector2D = new Vector2D(0, 0);

    constructor(parent: Parent, stats: {
        speed: Signal<number>;
        distance: Signal<number>;
        score: Signal<number>;
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

        collider.addOnCollisionCallback((other) => {
            if (other.layer === "obstacle") {
                if (this.velocity.magnitude() > 10) {
                    Game.endGame();
                }
                
                this.velocity = this.velocity.multiply(-0.5);
            }
        });
    }

    public override update(deltaTime: number): void {
        this.updatePhysics(deltaTime);

        this.updateStats();
        this.updateTrail();

        super.update(deltaTime);
    }

    private updateTrail() {
        SnowboarderTrail.instance?.addTrailPoint(
            this.worldPosition,
            Vector2D.fromAngle(this.rotation * (Math.PI / 180) - Math.PI / 2),
        );
    }

    private updateStats() {
        this.stats.speed.value = this.velocity.magnitude();
        this.stats.distance.value = this.worldPosition.y;
        this.stats.score.value = Math.floor(this.worldPosition.y / 10);
    }

    private updatePhysics(deltaTime: number) {
        const frictionStrength = 0.1; // Raising this lowers top speed (max 1)
        const gravityStrength = 140; // Raising this value makes the game feel faster
        const slipStrength = 325; // Raising this value makes turning more responsive
        const turnStrength = 200;

        // Apply gravity
        this.velocity.y += gravityStrength * deltaTime;

        // Rotate
        const radians = (this.rotation) * (Math.PI / 180);
        this.rotation += this.turnInput * deltaTime * turnStrength;

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

        // Update position
        this.worldPosition.set(
            this.worldPosition.add(this.velocity.multiply(deltaTime)),
        );
    }

    setTurnInput(turn: number) {
        this.turnInput = turn;
    }

    public reset() {
        this.worldPosition.set(new Vector2D(128, 128));
        this.velocity.set(new Vector2D(0, 0));
        this.rotation = 0;
    }
}
