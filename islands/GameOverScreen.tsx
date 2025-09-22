import { Component } from "preact";

interface GameOverScreenProps {
    onRestart: () => void;
}

export class GameOverScreen extends Component<GameOverScreenProps> {
    override render() {
        return (
            <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black bg-opacity-75 text-white">
                <h1 class="mb-4 text-4xl font-bold">Game Over</h1>
                <button
                    type="button"
                    class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    onClick={this.props.onRestart}
                >
                    Restart Game
                </button>
            </div>
        );
    }
}
