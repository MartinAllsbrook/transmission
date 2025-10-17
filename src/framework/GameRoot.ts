import { Container } from "pixi.js";
import { Camera } from "./Camera.ts";
import { GameObject } from "./GameObject.ts";

export class GameRoot {
    private stage: Container;

    private world: Container;
    private ui: Container;

    private camera: Camera;

    constructor(stage: Container) {
        this.stage = stage;

        this.world = new Container();
        this.stage.addChild(this.world);
        
        this.ui = new Container();
        this.stage.addChild(this.ui);

        this.camera = new Camera();
    }

    public update() {
        this.syncWorldToCamera();
    }

    private syncWorldToCamera() {
        this.world.position.set(
            -this.camera.Transform.WorldPosition.x,
            -this.camera.Transform.WorldPosition.y
        )
        this.world.rotation = -this.camera.Transform.Rotation;
        this.world.scale.set(
            1 / this.camera.Transform.scale.x,
            1 / this.camera.Transform.scale.y
        );
    }

    public setActiveCamera(camera: Camera) {
        this.camera = camera;
    }
    
    public addChild(child: GameObject) {
        // TODO: Implement this
    }

    public removeChild(child: GameObject) {
        // TODO: Implement this
    }

    public get Transform(): undefined {
        return undefined;
    } 
}