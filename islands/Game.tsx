import { Component } from "preact";
import { Application, Assets, Container, Sprite } from 'pixi.js';

import { InputManager } from "../src/client/inputs/InputManager.ts";
import { ValueInput } from "src/client/inputs/ValueInput.ts";

export default class Game extends Component {
    private gameContainer?: HTMLDivElement;
    private app?: Application;
    private spaceKeyPressed: boolean = false;

    private turnInput: number = 0;

    override async componentDidMount() {
        // Only run on client side
        if (typeof window !== 'undefined') {
            const { InputManager } = await import("../src/client/inputs/InputManager.ts");

            InputManager.getInput("turn").subscribe((newValue) => {
                console.log("Turn input changed:", newValue);
                this.turnInput = newValue;
            });
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

        // Declare the property on globalThis to avoid type error
        // deno-lint-ignore no-explicit-any
        (globalThis as any).__PIXI_APP__ = this.app;

        // Initialize the application
        await this.app.init({ background: '#1099bb', resizeTo: globalThis.window });

        // Append the application canvas to the game container
        this.gameContainer.appendChild(this.app.canvas);
        
        
        const headTexture = await Assets.load('/snowboarder/Head.png');
        const headSprite = new Sprite(headTexture);
        
        const bodyTexture = await Assets.load('/snowboarder/Body.png');
        const bodySprite = new Sprite(bodyTexture);
        
        const boardTexture = await Assets.load('/snowboarder/Board.png');
        const boardSprite = new Sprite(boardTexture);
        
        const snowboarderContainer = new Container();
        snowboarderContainer.addChild(boardSprite);
        snowboarderContainer.addChild(bodySprite);
        snowboarderContainer.addChild(headSprite);
        this.app.stage.addChild(snowboarderContainer);

        snowboarderContainer.x = this.app.screen.width / 2;
        snowboarderContainer.y = this.app.screen.height / 2;

        snowboarderContainer.pivot.x = snowboarderContainer.width / 2;
        snowboarderContainer.pivot.y = snowboarderContainer.height / 2;

        snowboarderContainer.scale.set(2.5, 2.5);
        

        // // Create a 5x5 grid of bunnies in the container
        // for (let i = 0; i < 25; i++) {
        //     const bunny = new Sprite(texture);

        //     bunny.x = (i % 5) * 40;
        //     bunny.y = Math.floor(i / 5) * 40;
        //     container.addChild(bunny);
        // }

        // // Move the container to the center
        // container.x = this.app.screen.width / 2;
        // container.y = this.app.screen.height / 2;

        // // Center the bunny sprites in local container coordinates
        // container.pivot.x = container.width / 2;
        // container.pivot.y = container.height / 2;

        // Listen for animate update
        this.app.ticker.add((ticker) => {
            // Continuously rotate the container!
            // * use delta to create frame-independent transform *
            // if (this.spaceKeyPressed) {
            //     container.rotation += 0.01 * ticker.deltaTime;
            // }

            snowboarderContainer.rotation += this.turnInput * 0.025 * ticker.deltaTime;

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
