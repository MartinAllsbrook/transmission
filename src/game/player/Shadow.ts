import { GameObject, GameRoot, TransformOptions, Vector2D } from "framework";
import { Graphics } from "pixi.js";
import { Player } from "./Player.ts";

export class Shadow extends GameObject {
    public override get Name(): string {
        return "Shadow";
    }
    public override get layer(): string {
        return "shadow";
    }

    private radius: number = 20;
    private shrinkFactor: number = 0.7;

    player: Player;

    constructor(
        parent: GameObject,
        player: Player,
        root: GameRoot,
        transformOptions?: TransformOptions,
    ) {
        super(parent, root, transformOptions);

        this.player = player;
    }

    protected override start() {
        let radius = this.radius;
        for (let i = 0; i < 3; i++) {
            const ellipse = new Graphics()
                .ellipse(0, 0, radius, radius / 2)
                .fill({
                    color: "#000000",
                    alpha: 0.15,
                });
            this.addGraphics(ellipse);
            radius *= this.shrinkFactor;
        }
    }

    protected override update(_deltaTime: number): void {
        const height = this.player.Height;

        this.Transform.Scale = new Vector2D(1, 1).multiply(1 + (height * 0.25));
    }
}
