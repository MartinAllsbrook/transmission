import { GameObject, Parent, Vector2D } from "framework";
import { Snowboarder } from "./snowboarder/Snowboarder.ts";
import { World } from "./world/World.ts";
import { TextManager } from "../scoring/TextManager.ts";
import { Snow } from "./world/snow/Snow.ts";

export class RootObject extends GameObject {
    private player: Snowboarder;
    private world: World;
    
    public static offset: Vector2D = new Vector2D(
        globalThis.innerWidth / 2,
        globalThis.innerHeight / 2.618,
    );

    constructor(parent: Parent) {
        super(
            parent,
            new Vector2D(globalThis.innerWidth / 2, globalThis.innerHeight / 2.618),
        );

        TextManager.initialize(this);
        this.player = new Snowboarder(this);
        this.world = new World(this, this.player);

        new Snow(this, this.world);

        this.AutoCenter = false;
    }

    public override get WorldPosition(): Vector2D {
        return new Vector2D(0, 0);
    }

    public reset() {
        this.player.reset();
        this.world.reset();
    }
}
