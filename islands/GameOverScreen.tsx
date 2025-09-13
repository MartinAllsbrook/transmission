import { Component } from "preact";

interface GameOverScreenProps {
    score: number;
    maxScore: number;
    distace: number;
    maxDistance: number;
    fastestSpeed: number;
    maxFastestSpeed: number;
    onRestart: () => void;
}

export class GameOverScreen extends Component<GameOverScreenProps> {
    override render() {
        return (
            <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black bg-opacity-75 text-white">
                <h1 class="mb-4 text-4xl font-bold">Game Over</h1>
                <p class="mb-2 text-lg">Score: {this.props.score.toFixed(0)}</p>
                <p class="mb-2 text-lg">
                    Max Score: {this.props.maxScore.toFixed(0)}
                </p>
                <p class="mb-2 text-lg">
                    Distance: {this.props.distace.toFixed(1)}m
                </p>
                <p class="mb-2 text-lg">
                    Max Distance: {this.props.maxDistance.toFixed(1)}m
                </p>
                <p class="mb-2 text-lg">
                    Fastest Speed: {this.props.fastestSpeed.toFixed(1)}km/h
                </p>
                <p class="mb-4 text-lg">
                    Max Fastest Speed:{" "}
                    {this.props.maxFastestSpeed.toFixed(1)}km/h
                </p>
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
