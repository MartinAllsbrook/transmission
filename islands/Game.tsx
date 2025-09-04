import { Component } from "preact";
import { Application, Assets, Container, Sprite } from 'pixi.js';

export default class Game extends Component {
    private gameContainer?: HTMLDivElement;
    private app?: Application;
    private spaceKeyPressed: boolean = false;

    override componentDidMount() {
        // Only run on client side
        if (typeof window !== 'undefined') {
            document.addEventListener('keydown', this.keydownHandler);
            document.addEventListener('keyup', this.keyupHandler);
            this.initPixiGame();
        }
    }
    
    override componentWillUnmount() {
        // Clean up event listener
        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
        }

        if (this.keyupHandler) {
            document.removeEventListener('keyup', this.keyupHandler);
        }
         
        // Clean up PixiJS application
        if (this.app) {
            this.app.destroy(true);
        }
    }
    
    // Create the keydown handler as a bound method
    private keydownHandler: (e: KeyboardEvent) => void = (e: KeyboardEvent) => {
        if (e.key === ' ' || e.code === 'Space') {
            this.spaceKeyPressed = true;
        }
    };

    // Create the keyup handler as a bound method
    private keyupHandler: (e: KeyboardEvent) => void = (e: KeyboardEvent) => {
        if (e.key === ' ' || e.code === 'Space') {
            this.spaceKeyPressed = false;
        }
    }


    /**
     * Initialize the PixiJS game
     */
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
        this.app.ticker.add((ticker) => {
            // Continuously rotate the container!
            // * use delta to create frame-independent transform *
            if (this.spaceKeyPressed) {
                container.rotation += 0.01 * ticker.deltaTime;
            }
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
