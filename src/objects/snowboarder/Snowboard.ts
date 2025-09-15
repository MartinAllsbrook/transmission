import { RectCollider } from "../../colliders/RectCollider.ts";
import { ExtraMath } from "../../math/ExtraMath.ts";
import { Vector2D } from "../../math/Vector2D.ts";
import { GameObject } from "../GameObject.ts";
import { SnowboarderTrail } from "./SnowbarderTrail.ts";
import { Snowboarder } from "./Snowboarder.ts"

export class Snowboard extends GameObject {
    private snowboarder: Snowboarder;

    private shiftyInput: number = 0;
    private lerpSpeed: number = 5; // Adjust this to control how fast the board

    constructor(parent: Snowboarder) {
        super(parent);
        this.container.label = "Snowboard";
        
        this.snowboarder = parent;
        this.setupCollider();

        this.setupInputs();
    }

    private async setupInputs() {
        const { InputManager } = await import("src/inputs/InputManager.ts");

        InputManager.getInput("shifty").subscribe((newValue) => {
            this.shiftyInput = newValue;
        });
    }

    public override update(deltaTime: number): void {
        


        const targetRotation = this.shiftyInput * 90;

        this.rotation = ExtraMath.lerpSafe(this.rotation, targetRotation, this.lerpSpeed * deltaTime);

        this.updateTrail();
        super.update(deltaTime);
    }

    private updateTrail() {
        if (this.snowboarder.InAir) return;

        SnowboarderTrail.instance?.addTrailPoint(
            this.WorldPosition,
            Vector2D.fromAngle(this.WorldRotation * (Math.PI / 180) - Math.PI / 2),
        );
    }

    public override async createSprite() {
        await this.loadSprite("/snowboarder/Board.png", 1);
        
        await super.createSprite();
    }

    private setupCollider() {
        const collider = new RectCollider(
            this,
            new Vector2D(0, 0),
            new Vector2D(32, 7),
            false,
            "player",
        );

        collider.onCollisionStart((other) => {
            this.snowboarder.onCollisionStart(other);
        });

        collider.onCollisionEnd((other) => {
            this.snowboarder.onCollisionEnd(other);
        });
    }
}