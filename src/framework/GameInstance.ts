import { Application } from "pixi.js";
import { GameRoot } from "./GameRoot.ts";
import { CollisionManager } from "./colliders/CollisionManager.ts";
import { LayerManager } from "framework";
import { Signal } from "@preact/signals";

export class GameInstance {
    public static instance: GameInstance;

    private app: Application;
    private container: HTMLElement;
    private root: GameRoot;

    private gameOverSignal: Signal<boolean>;
    private deathMessage: string | undefined;

    /**
     * @param container - the HTML container to attach the PixiJS application to
     */
    constructor(container: HTMLElement, gameOverSignal: Signal<boolean>) {
        GameInstance.instance = this;

        this.container = container;
        this.gameOverSignal = gameOverSignal;

        this.app = this.createPixiApp();
        LayerManager.initialize(this.app);
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
            autoDensity: true,
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
        CollisionManager.update();
    }

    public endGame(deathMessage: string) {
        this.deathMessage = deathMessage;
        this.gameOverSignal.value = true;

        this.app?.ticker.stop();
    }

    public resetGame() {
        this.deathMessage = undefined;
        this.gameOverSignal.value = false;

        this.app?.ticker.start();
        this.root?.reset();
    }

    public dispose() {
        this.app.destroy(true);
        this.container.innerHTML = "";
    }

    public get Root(): GameRoot {
        return this.root;
    }

    public get DeathMessage(): string | undefined {
        return this.deathMessage;
    }
}
