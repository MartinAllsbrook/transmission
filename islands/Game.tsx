import { Component } from "preact";
import { Signal } from "@preact/signals";

import { GameOverScreen } from "./GameOverScreen.tsx";

import { GameInstance, Vector2D } from "framework";
import { Player } from "src/game/player/Player.ts";
import { TestObject } from "src/game/TestObject.ts";
import { World } from "src/game/world/World.ts";
import { PlayerTracks } from "src/game/player/PlayerTracks.ts";

export default class Game extends Component {
    /** Reference to the game container div */
    private gameContainer?: HTMLDivElement;
    private game?: GameInstance;

    private gameOver: Signal<boolean> = new Signal(false);

    override async componentDidMount() {
        if (typeof window === "undefined") return; // Only run on client side

        this.game = new GameInstance(this.gameContainer!, this.gameOver); 
        await this.game.init();

        const player = new Player(this.game.Root, this.game.Root);
        const world = new World(this.game.Root, this.game.Root, player.Transform);
        new PlayerTracks(world, this.game.Root, player);
    }

    override componentWillUnmount() {
        this.game?.dispose();
    }

    // #region Game Initialization

    // #region Rendering

    render() {
        return (
            <div>
                {this.gameOver.value
                    ? (
                        <div>
                            <GameOverScreen
                                deathMessage={this.game?.DeathMessage || "You died! (I need to add a proper message here)"}
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
