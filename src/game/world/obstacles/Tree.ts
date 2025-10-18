import { GameObject } from "framework";

export class Tree extends GameObject {
    public override get Name(): string {
        return "Tree";
    }

    protected override start(): void {
        this.loadSprite("obsticales/Tree.png");
    }
}