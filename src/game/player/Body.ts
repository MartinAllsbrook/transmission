import { GameObject } from "framework";
import { Head } from "./Head.ts";
import { Player } from "./Player.ts";

export class Body extends GameObject {
    public override get Name() {
        return "Body";
    }
    public override get layer(): string {
        return "player2";
    }

    private head: Head = new Head(this, this.parent as Player, this.root); // TODO: Fix type cast

    protected override start(): void {
        this.loadSprite("snowboarder/Body.png");
    }

    public get Head(): Head {
        return this.head;
    }
}
