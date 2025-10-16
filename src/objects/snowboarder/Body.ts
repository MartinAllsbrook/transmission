import { GameObject } from "../../framework/GameObject.ts";
import { Head } from "./Head.ts";
import { Snowboarder } from "./Snowboarder.ts";

export class Body extends GameObject {
    private snowboarder: Snowboarder;
    private head: Head;

    constructor(parent: Snowboarder) {
        super(parent);
        this.container.label = "Body";

        this.snowboarder = parent;
        this.head = new Head(this, this.snowboarder);

        this.rotation = 90;
    }

    protected override async createOwnSprites(): Promise<void> {
        await this.loadSprite("/snowboarder/Body.png");
    }

    public get Head(): Head {
        return this.head;
    }
}