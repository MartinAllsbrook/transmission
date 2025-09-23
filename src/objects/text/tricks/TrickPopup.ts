import { Graphics, TextStyle } from "pixi.js";
import { GameObject } from "../../GameObject.ts";
import { RichText } from "../RichText.ts";

export class TrickPopup extends RichText {
    constructor(parent: GameObject, content: string) {
        super(parent, content, new TextStyle({
            fontSize: 16,
            fontWeight: "bold",
            fill: "#000000",
        }), { x: 0.5, y: 0.5 } );

    }

    protected override createOwnSprites(): Promise<void> {
        const width = 256;
        const height = 24;

        const graphic = new Graphics()
        .rect(-width / 2, -height / 2 - 1, width, height)
        .fill({ color: "Yellow" })
        .stroke({ color: "Black", width: 1 })

        this.container.addChildAt(graphic, 0);

        return super.createOwnSprites();
    }

    public destroyAfter(time: number = 1.25) {
        setTimeout(() => this.destroy(), time * 1000);
    }
}