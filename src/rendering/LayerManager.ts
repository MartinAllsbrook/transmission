import { Application, IRenderLayer, RenderLayer } from "pixi.js";
import { Snowboarder } from "../objects/snowboarder/Snowboarder.ts";

export class LayerManager {
    public static layers: Record<string, IRenderLayer> = {
        background: new RenderLayer(),
        shadows: new RenderLayer(),
        foreground: new RenderLayer(),
        
    };

    public static initialize(app: Application) {
        for (const layerName in LayerManager.layers)
            app.stage.addChild(LayerManager.layers[layerName]);
    }

    public static getLayer(name: string): IRenderLayer {
        if (!this.layers[name]) {
            console.warn(`Layer "${name}" does not exist. Creating new layer.`);
            this.layers[name] = new RenderLayer();
        }
        return this.layers[name];
    }
}
