import { Component } from "preact";
import { Application } from "pixi.js";

import { Snowboarder } from "src/objects/Snowboarder.ts";
import { World } from "src/objects/World.ts";
import { CollisionManager } from "src/colliders/CollisionManager.ts";
import { OffsetContainer } from "src/objects/OffsetContainer.ts";

export default class Game extends Component {
    private gameContainer?: HTMLDivElement;
    private app?: Application;
    private spaceKeyPressed: boolean = false;

    private turnInput: number = 0;

    public static app?: Application;

    override componentDidMount() {
        // Only run on client side
        if (typeof window !== "undefined") {
            this.initPixiGame();
        }
    }

    override componentWillUnmount() {
        // Clean up PixiJS application
        if (this.app) {
            this.app.destroy(true);
        }
    }

    /**
     * Initialize the PixiJS game
     */
    private async initPixiGame() {
        if (!this.gameContainer) return;

        // Create a new application
        this.app = new Application();
        Game.app = this.app;

        // Declare the property on globalThis to avoid type error
        // deno-lint-ignore no-explicit-any
        (globalThis as any).__PIXI_APP__ = this.app;

        // Initialize the application
        await this.app.init({
            background: "#1099bb",
            resizeTo: globalThis.window,
        });

        // Append the application canvas to the game container
        this.gameContainer.appendChild(this.app.canvas);

        const worldContainer = new OffsetContainer(this.app);
        const snowboarder = new Snowboarder(worldContainer);
        const world = new World(worldContainer, snowboarder);

        // Listen for animate update
        this.app.ticker.add((ticker) => {
            worldContainer.update(ticker.deltaTime);
            CollisionManager.checkCollisions();
        });
    }

    render() {
        return (
            <div>
                <div ref={(el) => this.gameContainer = el || undefined}></div>
            </div>
        );
    }
}
