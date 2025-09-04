import { Component } from "preact";
import { Application, Assets, Container, Sprite } from 'pixi.js';

export default class Game extends Component {
    private gameContainer?: HTMLDivElement;
    private app?: Application;

    override componentDidMount() {
        // Only run on client side
        if (typeof window !== 'undefined') {
            this.initPixiGame();
        }
    }

    override componentWillUnmount() {
        // Clean up PixiJS application
        if (this.app) {
            this.app.destroy(true);
        }
    }

    private async initPixiGame() {
        if (!this.gameContainer) return;

        // Create a new application
        this.app = new Application();

        // Initialize the application
        await this.app.init({ background: '#1099bb', resizeTo: globalThis.window });

        // Append the application canvas to the game container
        this.gameContainer.appendChild(this.app.canvas);

        // Create and add a container to the stage
        const container = new Container();

        this.app.stage.addChild(container);

        // Load the bunny texture
        const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

        // Create a 5x5 grid of bunnies in the container
        for (let i = 0; i < 25; i++) {
            const bunny = new Sprite(texture);

            bunny.x = (i % 5) * 40;
            bunny.y = Math.floor(i / 5) * 40;
            container.addChild(bunny);
        }

        // Move the container to the center
        container.x = this.app.screen.width / 2;
        container.y = this.app.screen.height / 2;

        // Center the bunny sprites in local container coordinates
        container.pivot.x = container.width / 2;
        container.pivot.y = container.height / 2;

        // Listen for animate update
        this.app.ticker.add((time) => {
            // Continuously rotate the container!
            // * use delta to create frame-independent transform *
            container.rotation -= 0.01 * time.deltaTime;
        });
    }

    render() {
        return (
            <div>
                <h1>Game</h1>
                <div ref={(el) => this.gameContainer = el || undefined}></div>
            </div>
        );
    }
}
