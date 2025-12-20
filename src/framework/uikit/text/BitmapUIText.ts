import { GameRoot, UIElement } from "framework";
import { UITransformOptions } from "../../UITransform.ts";
import { BitmapFontInstallOptions, BitmapText } from "pixi.js";
import { BitmapTextManager } from "./BitmapTextManager.ts";

export class BitmapUIText extends UIElement {
    public override get Name(): string { return "BitmapUIText"; }

    private text: string = "";
    private textSprite: BitmapText;

    constructor(
        parent: UIElement | GameRoot,
        root: GameRoot,
        textOptions?: BitmapFontInstallOptions,
        transformOptions?: UITransformOptions,
    ) {
        super(parent, root, transformOptions);

        if (!textOptions || !textOptions.style || !textOptions.name) {
            textOptions = {
                name: "Default",
                style: {    
                    fontFamily: "Arial",
                    fontSize: 12,
                    fill: "#000000",
                }
            };
        } 

        BitmapTextManager.installFont(textOptions);

        this.textSprite = new BitmapText({...textOptions});

        this.addGraphics(this.textSprite);
    }

    public updateText(newText: string): void {
        this.text = newText;

        if (this.textSprite) {
            this.textSprite.text = this.text;
        }
    }
}