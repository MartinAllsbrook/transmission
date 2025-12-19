import { Container } from "pixi.js";
import { Camera } from "./Camera.ts";
import { BaseObject } from "./BaseObject.ts";

export class GameRoot {
    private stage: Container;

    private world: Container;
    private ui: Container;

    private camera: Camera;

    private children: BaseObject[] = [];

    constructor(stage: Container) {
        this.stage = stage;

        this.world = new Container();
        this.stage.addChild(this.world);
        
        this.ui = new Container();
        this.stage.addChild(this.ui);

        this.world.label = "World";
        this.ui.label = "UI";

        this.camera = new Camera();
    }

    public update(deltaTime: number) {
        this.syncWorldToCamera();

        for (const child of this.children) {
            child.baseUpdate(deltaTime);
        }
    }

    public reset() {
        for (const child of this.children) {
            child.baseReset();
        }
    }


    private syncWorldToCamera() {
        this.world.position.set(
            -this.camera.Transform.WorldPosition.x + globalThis.innerWidth / 2,
            -this.camera.Transform.WorldPosition.y + globalThis.innerHeight / 2
        )
        this.world.rotation = -this.camera.Transform.Rotation;
        this.world.scale.set(
            1 / this.camera.Transform.Scale.x,
            1 / this.camera.Transform.Scale.y
        );
    }

    public setActiveCamera(camera: Camera) {
        this.camera = camera;
    }
    
    public addChild(child: BaseObject) {
        this.children.push(child);
    }

    public removeChild(child: BaseObject) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        } else {
            console.warn("Attempted to remove a child that does not exist on the GameRoot.");
        }
    }

    public addContainer(container: Container, toUI: boolean = false) {
        if (toUI) {
            this.ui.addChild(container);
        } else {
            this.world.addChild(container);
        }
    }

    public removeContainer(container: Container, fromUI: boolean = false) {
        if (fromUI) {
            this.ui.removeChild(container);
        } else {
            this.world.removeChild(container);
        }
    }

    public get Transform(): undefined {
        return undefined;
    }

    public get Camera(): Camera {
        return this.camera;
    }
}