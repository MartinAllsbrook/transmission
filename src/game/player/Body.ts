import { GameObject } from "framework";
import { Head } from "./Head.ts";

export class Body extends GameObject {
    public override get Name() { return "Body"; }

    private head: Head = new Head(this, this.root);

    protected override start(): void {
        this.loadSprite("snowboarder/Body.png");
    }

    public get Head(): Head {
        return this.head;
    }
}