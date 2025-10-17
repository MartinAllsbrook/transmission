import { Component } from "preact";
import { Signal } from "@preact/signals";

import { Application } from "pixi.js";

import { RootObject } from "src/objects/RootObject.ts";
import { GameOverScreen } from "./GameOverScreen.tsx";

import { GameInstance, Vector2D } from "framework";
import { TestObject } from "src/TestObject.ts";

export default class Game extends Component {
    /** Reference to the game container div */
    private gameContainer?: HTMLDivElement;
    private game?: GameInstance;

    /** Global acess to the pixi app for debugging draw calls */
    public static app?: Application;

    private static deathMessage: string | undefined;
    private static gameOver: Signal<boolean> = new Signal(false);

    /** The the root container of the game, also used to center the game on the screen */
    private static rootObject?: RootObject;

    override async componentDidMount() {
        if (typeof window === "undefined") return; // Only run on client side

        this.game = new GameInstance(this.gameContainer!); 
        await this.game.init()

        new TestObject(this.game.Root, this.game.Root);
        const camera = this.game.Root.Camera;

        camera.Transform.Position = new Vector2D(
            -globalThis.innerWidth / 2, 
            -globalThis.innerHeight / 2
        );
    }

    override componentWillUnmount() {
        // Clean up PixiJS application
        if (Game.app) {
            Game.app.destroy(true);
        }
    }

    // #region Game Initialization

    // #region Rendering

    render() {
        return (
            <div>
                {Game.gameOver.value
                    ? (
                        
                        <div>
                            <GameOverScreen
                                deathMessage={Game.deathMessage}
                                onRestart={() => {
                                    this.game?.resetGame();
                                }}
                            />
                        </div>
                    )
                    : (
                        <div class="absolute top-0 left-0 z-10 flex flex-col gap-2 p-2">

                        </div>
                    )}

                <div ref={(el) => this.gameContainer = el || undefined}></div>
            </div>
        );
    }

    // #endregion
}
