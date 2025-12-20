import { GameObject, RectCollider, Vector2D } from "framework";
import { SnowboarderTrail } from "./SnowbarderTrail.ts";
import { Snowboarder } from "./Snowboarder.ts";

export class Snowboard extends GameObject {
    private snowboarder: Snowboarder;

    private lerpSpeed: number = 5; // Adjust this to control how fast the board

    constructor(parent: Snowboarder) {
        super(parent);
        this.container.label = "Snowboard";

        this.snowboarder = parent;
        this.setupCollider();
    }

    public override update(deltaTime: number): void {
        this.updateTrail();
        super.update(deltaTime);
    }

    private updateTrail() {
        if (this.snowboarder.StateName !== "ground") return;

        SnowboarderTrail.instance?.addTrailPoint(
            this.WorldPosition,
            Vector2D.fromAngle(
                this.WorldRotation * (Math.PI / 180) - Math.PI / 2,
            ),
        );
    }

    protected override async createOwnSprites(): Promise<void> {
        await this.loadSprite("/snowboarder/Board.png");
    }

    private setupCollider() {
        const collider = new RectCollider(
            this,
            new Vector2D(0, 0),
            new Vector2D(32, 7),
            false,
            "player",
        );

        collider.onCollisionEnter((other) => {
            this.snowboarder.onCollisionEnter(other);
        });

        collider.onCollisionStay((other) => {
            this.snowboarder.onCollisionStay(other);
        });

        collider.onCollisionExit((other) => {
            this.snowboarder.onCollisionExit(other);
        });
    }
}
