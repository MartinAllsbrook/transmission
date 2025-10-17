import { Application } from "pixi.js";
import { GameRoot } from "./GameRoot.ts";

export class GameInstance {
    private app: Application;
    private container: HTMLElement;
    private root: GameRoot;

    /**
     * 
     * @param container - the HTML container to attach the PixiJS application to
     */
    constructor(container: HTMLElement) {
        this.container = container;

        this.app = this.createPixiApp();

        this.root = new GameRoot(this.app.stage);
    } 
    
    private createPixiApp(): Application {
        const app = new Application();
        // deno-lint-ignore no-explicit-any
        (globalThis as any).__PIXI_APP__ = app; 
        return app;
    }

    public async init() {
        await this.initializePixiApp();
    
        this.setupGame();

        this.startGameLoop();
    }

    private async initializePixiApp() {
        await this.app.init({
            background: "#ffffff",
            resizeTo: globalThis.window,
            antialias: true,
            resolution: globalThis.devicePixelRatio || 1,
            autoDensity: true
        });

        this.container.appendChild(this.app.canvas);


    }

    private setupGame() {
        // LayerManager.initialize(Game.app);
    }

    private startGameLoop() {
        this.app.ticker.add((ticker) => {
            this.gameLoop(ticker.deltaMS);
        });
    }

    private gameLoop(deltaTimeMS: number) {
        this.root.update(deltaTimeMS / 1000);
    }

    public resetGame() {
        // Reset game logic goes here
    }

    public get Root(): GameRoot {
        return this.root;
    }
}