import { Component } from "preact";
import { Signal } from "@preact/signals";

import { GameOverScreen } from "./GameOverScreen.tsx";

import { GameInstance } from "framework";
import { Player } from "src/game/player/Player.ts";
import { TestObject } from "src/game/TestObject.ts";
import { Tree } from "src/game/world/obstacles/Tree.ts";

export default class Game extends Component {
    /** Reference to the game container div */
    private gameContainer?: HTMLDivElement;
    private game?: GameInstance;

    private deathMessage: string | undefined;
    private gameOver: Signal<boolean> = new Signal(false);

    override async componentDidMount() {
        if (typeof window === "undefined") return; // Only run on client side

        this.game = new GameInstance(this.gameContainer!); 
        await this.game.init()

        new Player(this.game.Root, this.game.Root);
        new TestObject(this.game.Root, this.game.Root);
        new Tree(this.game.Root, this.game.Root);
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
                                deathMessage={this.deathMessage}
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
