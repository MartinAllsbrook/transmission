import { Component } from "preact";
import { Application } from "pixi.js";

import { Snowboarder } from "src/objects/Snowboarder.ts";
import { World } from "src/objects/World.ts";
import { CollisionManager } from "src/colliders/CollisionManager.ts";
import { OffsetContainer } from "src/objects/OffsetContainer.ts";
import { StatDisplay } from "../components/StatDisplay.tsx";
import { Signal } from "@preact/signals";

export default class Game extends Component {
    /** Global acess to the pixi app for debugging draw calls */
    public static app?: Application;
    
    /** Reference to the game container div */
    private gameContainer?: HTMLDivElement;

    /** PixiJS application instance */
    private app?: Application;

    /** Set of signals to extract info from the player */
    private stats = {
        speed: new Signal(0),
        distance: new Signal(0),
        score: new Signal(0),
    };

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
        new World(worldContainer, snowboarder);

        // Listen for animate update
        this.app.ticker.add((ticker) => {
            worldContainer.update(ticker.deltaTime);
            CollisionManager.checkCollisions();
        });
    }

    render() {
        return (
            <div>
                <div class="w-screen h-screen">
                    <div>
                        <StatDisplay name="Speed" value={0} highest={0} />
                        <StatDisplay name="Distance" value={0} highest={0} />
                        <StatDisplay name="Score" value={0} highest={0} />
                    </div>
                </div>
                {/* <div ref={(el) => this.gameContainer = el || undefined}></div> */}
            </div>
        );
    }
}
