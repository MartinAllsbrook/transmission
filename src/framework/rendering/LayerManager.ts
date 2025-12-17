import { Application, RenderLayer } from "pixi.js";

export class LayerManager {
    public static layers: Record<string, RenderLayer> = {
        trail: new RenderLayer(),
        default: new RenderLayer(),
        ui: new RenderLayer(),
    };

    public static initialize(app: Application) {
        for (const layerName in LayerManager.layers)
            app.stage.addChild(LayerManager.layers[layerName]);
    }

    public static getLayer(name: string): RenderLayer {
        if (!this.layers[name]) {
            console.warn(`Layer "${name}" does not exist. Creating new layer.`);
            this.layers[name] = new RenderLayer();
        }
        return this.layers[name];
    }
}
