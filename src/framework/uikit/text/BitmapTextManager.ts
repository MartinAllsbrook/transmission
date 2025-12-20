import { BitmapFont, BitmapFontInstallOptions } from "pixi.js";

export class BitmapTextManager {
    static installedFonts: Set<BitmapFontInstallOptions> = new Set();

    static installFont(options: BitmapFontInstallOptions) {
        if (!this.installedFonts.has(options)) {
            BitmapFont.install(options);
            this.installedFonts.add(options);
        }
    }
}