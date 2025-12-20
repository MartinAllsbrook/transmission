import { GameObject, LayerManager, RectCollider, Vector2D } from "framework";

export class Jump extends GameObject {
    constructor(parent: GameObject, position: Vector2D) {
        super(parent, position);
        this.container.label = "Jump";

        new RectCollider(
            this,
            new Vector2D(0, 0),
            new Vector2D(48, 32),
            true,
            "jump",
        );
        LayerManager.getLayer("background")?.attach(this.container);
    }

    protected override async createOwnSprites(): Promise<void> {
        await this.loadSprite("/jumps/SkiJump.png", {
            scale: new Vector2D(2, 2),
        });
    }
}
