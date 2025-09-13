import { Component } from "preact";
import { Application } from "pixi.js";

import { Snowboarder } from "src/objects/Snowboarder.ts";
import { World } from "src/objects/World.ts";
import { CollisionManager } from "src/colliders/CollisionManager.ts";
import { OffsetContainer } from "src/objects/OffsetContainer.ts";
import { Signal } from "@preact/signals";
import { GameOverScreen } from "./GameOverScreen.tsx";
import { StatDisplay } from "../components/StatDisplay.tsx";
import { textChangeRangeIsUnchanged } from "https://deno.land/x/ts_morph@21.0.1/common/typescript.d.ts";

export default class Game extends Component {
    /** Global acess to the pixi app for debugging draw calls */
    public static app?: Application;

    private static gameOver: boolean = false;

    /** Reference to the game container div */
    private gameContainer?: HTMLDivElement;

    /** PixiJS application instance */
    private app?: Application;

    private static player?: Snowboarder;

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
            background: "#ffffff",
            resizeTo: globalThis.window,
        });

        // Append the application canvas to the game container
        this.gameContainer.appendChild(this.app.canvas);

        const worldContainer = new OffsetContainer(this.app);
        Game.player = new Snowboarder(worldContainer, this.stats);
        new World(worldContainer, Game.player);

        // Listen for animate update
        this.app.ticker.add((ticker) => {
            worldContainer.update(ticker.deltaTime);
            CollisionManager.checkCollisions();
        });
    }

    public static endGame() {
        Game.gameOver = true;
        this.app?.ticker.stop();
    }

    public static get Over() {
        return Game.gameOver;
    }

    public static resetGame() {
        Game.gameOver = false;
        this.app?.ticker.start();

        this.player?.reset();
    }

    render() {
        return (
            <div>
                {Game.gameOver
                    ? (
                        <div>
                            <GameOverScreen
                                score={this.stats.score.value}
                                maxScore={0}
                                distace={this.stats.distance.value}
                                maxDistance={0}
                                fastestSpeed={this.stats.speed.value}
                                maxFastestSpeed={0}
                                onRestart={() => {
                                    Game.resetGame();
                                }}
                            />
                        </div>
                    )
                    : (
                        <div class="absolute top-0 left-0 z-10 flex flex-col gap-2 p-2">
                            <StatDisplay
                                name="Speed"
                                value={this.stats.speed.value}
                                highest={0}
                            />
                            <StatDisplay
                                name="Distance"
                                value={this.stats.distance.value}
                                highest={0}
                            />
                            <StatDisplay
                                name="Score"
                                value={this.stats.score.value}
                                highest={0}
                            />
                        </div>
                    )}

                <div ref={(el) => this.gameContainer = el || undefined}></div>
            </div>
        );
    }
}
