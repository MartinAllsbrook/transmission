import { Component } from "preact";
import { Application } from "pixi.js";

import { Snowboarder } from "src/objects/Snowboarder.ts";
import { World } from "src/objects/World.ts";
import { CollisionManager } from "src/colliders/CollisionManager.ts";
import { OffsetContainer } from "src/objects/OffsetContainer.ts";
import { Signal } from "@preact/signals";
import { GameOverScreen } from "./GameOverScreen.tsx";
import { StatDisplay } from "../components/StatDisplay.tsx";

export default class Game extends Component {
    /** Reference to the game container div */
    private gameContainer?: HTMLDivElement;

    /** Global acess to the pixi app for debugging draw calls */
    public static app?: Application;

    /** Global acess to the game over state */
    private static gameOver: boolean = false;

    /** The the root container of the game, also used to center the game on the screen */
    private static rootObject?: OffsetContainer;

    /** The main player object */
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
        if (Game.app) {
            Game.app.destroy(true);
        }
    }

    // #region Game Initialization
    
    /**
     * Initialize the PixiJS game
     */
    private async initPixiGame() {
        if (!this.gameContainer) return;

        // Create a new application
        Game.app = new Application();

        // Initialize the application
        await Game.app.init({
            background: "#ffffff",
            resizeTo: globalThis.window,
        });

        // Append the application canvas to the game container
        this.gameContainer.appendChild(Game.app.canvas);

        this.setupGame();
        await this.createVisuals();
        this.startGameLoop();
    }

    /**
     * Create the game objects (pre-visuals)
     */
    private setupGame() {
        if (!Game.app) throw new Error("PixiJS application not initialized");

        Game.rootObject = new OffsetContainer(Game.app);
        Game.player = new Snowboarder(Game.rootObject, this.stats);
        new World(Game.rootObject, Game.player);
    }

    /**
     * Marches though the gameobject tree and calls createVisuals on each object
     */
    private async createVisuals() {

    }

    /**
     * Starts the game loop
     */
    private startGameLoop() {
        if (!Game.app) throw new Error("PixiJS application not initialized");
        
        // Start the game loop
        Game.app.ticker.add((ticker) => {this.gameLoop(ticker.deltaMS);});
    }

    /**
     * The main game loop, called every frame
     * @param deltaMS Time since last frame in milliseconds
     */
    private gameLoop(deltaMS: number) {
        const deltaTime = deltaMS / 1000; // Convert ms to s

        if (!Game.app || !Game.rootObject || !Game.player) throw new Error("Game not properly initialized");

        Game.rootObject.update(deltaTime); // This will also update all child gameobjects
        CollisionManager.checkCollisions();
    }

    // #endregion

    // #region Game State Management

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

    // #endregion

    // #region Rendering

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

    // #endregion
}
