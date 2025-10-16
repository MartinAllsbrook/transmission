import { Application, IRenderLayer, RenderLayer } from "pixi.js";

export class LayerManager {
    public static layers: Record<string, IRenderLayer> = {
        background: new RenderLayer(),
        trail: new RenderLayer(),
        shadows: new RenderLayer(),
        snowboarder: new RenderLayer(),
        foreground: new RenderLayer(),
        snowLayer0: new RenderLayer(),
        snowLayer1: new RenderLayer(),
        snowLayer2: new RenderLayer(),
        ui: new RenderLayer(),
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
