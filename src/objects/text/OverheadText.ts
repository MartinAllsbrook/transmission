import { Text, TextStyle } from "pixi.js";
import { GameObject, Parent } from "../GameObject.ts";
import { Vector2D } from "../../math/Vector2D.ts";
import { LayerManager } from "../../rendering/LayerManager.ts";

export class OverheadText  extends GameObject {
    private text: string;
    private color: string;
    private textSize: number;
    private lifetime: number;
    constructor(
        parent: Parent, 
        text: string, 
        color: string = "#000000",
        size: number = 4, 
        lifetime: number = 4
    ) {
        super(parent);
        
        this.position.set(new Vector2D(0, -32));

        this.text = text;
        this.color = color;
        this.textSize = size;
        this.lifetime = lifetime;

        LayerManager.getLayer("ui")?.attach(this.container);
    }

    protected override async createOwnSprites(): Promise<void> {
        await Promise.resolve(); // Ensure async context

        const style = new TextStyle({
            fontFamily: "Arial",
            fontSize: 8 * this.textSize,
            fill: this.color,
            // stroke: this.color,
            fontWeight: "bold",
        });

        const textSprite = new Text();
        textSprite.style = style;
        textSprite.text = this.text;
        textSprite.anchor.set(0.5);
        this.container.addChild(textSprite);
        this.container.label = "TextPopup";
    }


    public override update(deltaTime: number): void {
        this.position.y -= 16 * deltaTime;
        this.container.alpha -= (1 / this.lifetime) * deltaTime;
        this.lifetime -= deltaTime;
        if (this.lifetime <= 0) {
            this.destroy();
            return; // Exit early to prevent accessing destroyed properties
        }

        super.update(deltaTime);
    }
}