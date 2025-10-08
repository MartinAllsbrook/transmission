import { GameObject, Parent } from "../GameObject.ts";
import { Vector2D } from "../../math/Vector2D.ts";
import Game from "islands/Game.tsx";
import { LayerManager } from "../../rendering/LayerManager.ts";
import { SATCollider } from "../../colliders/SATCollider.ts";
import { Snowboard } from "./Snowboard.ts";
import { Body } from "./Body.ts";
import { ExtraMath } from "../../math/ExtraMath.ts";
import { Shadow } from "./Shadow.ts";
import { InputManager } from "../../inputs/InputManager.ts";
import { TricksManager } from "./TricksManager.ts";
  
export class Snowboarder extends GameObject {
    // Inputs
    private turnInput: number = 0;
    private jumpInput: boolean = false;
    private shiftyInput: number = 0;
        
    /** The position of the player in the world, used for world scrolling */
    public worldPosition: Vector2D = new Vector2D(128, 128);
    
    // Physics & State
    private velocity: Vector2D = new Vector2D(0, 0);
    private rotationRate: number = 0;
    
    private inAir = false;
    private verticalVelocity: number = 0;
    private height: number = 0;
    
    // Shifty
    private shiftyTargetAngle: number = 0;
    private shiftyAngle: number = 0;    
    private shiftyLerpSpeed: number = 3;
    private maxShiftyAngle: number = 90;
    
    // Components
    private shadow: Shadow;
    private snowboard: Snowboard;
    private body: Body;
    private tricksManager: TricksManager;

    constructor(parent: Parent) {
        super(parent);

        this.shadow = new Shadow(parent);
        this.snowboard = new Snowboard(this);
        this.body = new Body(this);

        this.setupInputs();

        LayerManager.getLayer("snowboarder")?.attach(this.container);
        this.tricksManager = new TricksManager(this);

    }

    // #region Miscellaneous

    private setupInputs() {
        InputManager.getInput("turn").subscribe((newValue) => {
            this.turnInput = newValue;
        });

        InputManager.getInput("jump").subscribe((newValue) => {
            this.jumpInput = newValue;
        });

        InputManager.getInput("shifty").subscribe((newValue) => {
            this.shiftyInput = newValue;
        });
    }

    public reset() {
        this.worldPosition.set(new Vector2D(128, 128));
        this.velocity.set(new Vector2D(0, 0));
        this.rotation = 0;

        this.tricksManager.reset();
    }

    // #endregion

    // #region Collisions

    public onCollisionStart(other: SATCollider): void {
        if (other.layer === "obstacle") {
            if (this.velocity.magnitude() > 10) {
                Game.endGame("You crashed into an obstacle!");
            }
            
            this.velocity = this.velocity.multiply(-0.5);
        }

        // If we hit a jump and we're not already in the air, add some height and velocity - wont be used until we enter the air
        if (other.layer === "jump" && !this.InAir) {
            this.height += 1;
            this.verticalVelocity = this.velocity.magnitude() * 0.0075;
        }
    }

    public onCollisionEnd(other: SATCollider): void {
        // At the end of a jump if the player isnt in the air, put them in the air
        if (other.layer === "jump" && !this.InAir) {
            this.InAir = true;
        }
    }

    // #endregion

    // #region Update

    public override update(deltaTime: number): void {
        if (this.jumpInput && !this.InAir) { // Jump
            this.verticalVelocity += 4;
            this.InAir = true;
        };
        
        if (this.InAir) {
            this.airUpdate(deltaTime);
        } else {
            this.groundUpdate(deltaTime);
        }   
        
        this.updatePhysics(deltaTime); // 2D physics

        // const speed = this.velocity.magnitude();
        // if (speed > 300) {
        //     this.timeGoingFast += deltaTime;
        // } else if (this.timeGoingFast > 2) {
        //     const points = Math.floor(this.timeGoingFast * 10);
        //     this.addScore(points);
        //     this.timeGoingFast = 0;
        // }

        this.scale = new Vector2D(1 + this.height * 0.15, 1 + this.height * 0.15);
        this.shadow.setEffects(this.height, this.snowboard.WorldRotation);

        super.update(deltaTime);
    }
    
    private updatePhysics(deltaTime: number) {
        const turnStrength = 250;

        this.rotation += this.rotationRate * deltaTime * turnStrength;

        // Update position
        this.worldPosition.set(
            this.worldPosition.add(this.velocity.multiply(deltaTime)),
        );
    }

    // #endregion

    // #region Air

    // private onEnterAir() {
    //     this.switchToAirShifty();
    //     this.tricksManager.trickStart(
    //         this.snowboard.WorldRotation, 
    //         this.velocity.heading() * 180 / Math.PI
    //     );
    // }

    // private airUpdate(deltaTime: number) {
    //     this.applyAirShiftyUpdate(deltaTime);
    //     this.airPhysicsUpdate(deltaTime); 
    //     this.tricksManager.trickUpdate(
    //         deltaTime,
    //         this.snowboard.WorldRotation, 
    //         this.velocity.heading() * 180 / Math.PI
    //     );
    // }

    // private switchToAirShifty() {
    //     this.shiftyAngle = this.shiftyAngle * -1;
    //     this.rotation = this.body.WorldRotation - 90; // Flip for goofy
    //     this.snowboard.Rotation = this.shiftyAngle;
    //     this.body.Rotation = 0 + 90; // Flip for goofy
    // }

    // private applyAirShiftyUpdate(deltaTime: number) {
    //     this.shiftyTargetAngle = this.shiftyInput * -this.maxShiftyAngle;
    //     this.shiftyAngle = ExtraMath.lerpSafe(this.shiftyAngle, this.shiftyTargetAngle, this.shiftyLerpSpeed * deltaTime);
    //     this.snowboard.Rotation = this.shiftyAngle;
    // }

    // private airPhysicsUpdate(deltaTime: number) {
    //     this.verticalVelocity -= 16  * deltaTime;
    //     this.height += this.verticalVelocity * deltaTime;

    //     if (this.height <= 0) {
    //         this.height = 0;
    //         this.verticalVelocity = 0;
    //         this.InAir = false;
    //     }
    // }

    // #endregion

    // #region Ground

    // private onEnterGround() {
    //     this.switchToGroundShifty();
    //     this.tricksManager.endSpin(
    //         this.snowboard.WorldRotation, 
    //         this.velocity.heading() * 180 / Math.PI
    //     );
    // }

    // private groundUpdate(deltaTime: number) {
    //     this.applyGroundShiftyUpdate(deltaTime);
    //     this.groundPhysicsUpdate(deltaTime);
    // }

    // private switchToGroundShifty() {
    //     this.shiftyAngle = this.shiftyAngle * -1;
    //     this.rotation = this.snowboard.WorldRotation;
    //     this.body.Rotation = this.shiftyAngle + 90; // Flip for goofy
    //     this.snowboard.Rotation = 0; 
    // }

    // private applyGroundShiftyUpdate(deltaTime: number) {
    //     this.shiftyTargetAngle = this.shiftyInput * this.maxShiftyAngle;
    //     this.shiftyAngle = ExtraMath.lerpSafe(this.shiftyAngle, this.shiftyTargetAngle, this.shiftyLerpSpeed * deltaTime);
    //     this.body.Rotation = this.shiftyAngle + 90; // Flip for goofy
    // }
    
    // private groundPhysicsUpdate(deltaTime: number) {
    //     const frictionStrength = 0.1; // Raising this lowers top speed (max 1)
    //     const gravityStrength = 140; // Raising this value makes the game feel faster
    //     const slipStrength = 325; // Raising this value makes turning more responsive

    //     // Apply gravity
    //     this.velocity.y += gravityStrength * deltaTime;

    //     // Rotate
    //     this.rotationRate += (this.turnInput - this.rotationRate) * deltaTime * 10;
        
    //     const radians = (this.snowboard.WorldRotation) * (Math.PI / 180);

    //     // Normal force
    //     const forward = Vector2D.fromAngle(radians - Math.PI / 2);
    //     const direction = this.velocity.normalize();
    //     const projected = direction.projectOnto(forward);
    //     const normal = projected.subtract(direction);

    //     const strength = Math.pow((1 - normal.magnitude()), 2) * 0.25 + 1;
    //     const normalDirection = projected.subtract(direction).normalize().multiply(strength);

    //     this.velocity = this.velocity.add(normalDirection.multiply(deltaTime * slipStrength));

    //     // Friction
    //     this.velocity = this.velocity.multiply(
    //         1 - frictionStrength * deltaTime,
    //     );
    // }

    // #endregion

    // #region Rail

    

    // #endregion

    // #region Getters & Setters

    public override get WorldPosition(): Vector2D {
        return this.worldPosition.clone();
    }


    public get InAir(): boolean {
        return this.inAir;
    }

    public set InAir(value: boolean) {
        if (this.inAir === value) return;

        this.inAir = value;
   
        if (this.inAir) {
            this.onEnterAir();
        } else {
            this.onEnterGround();
        }     
    }

    public get Velocity(): Vector2D {
        return this.velocity.clone();
    }

    public set Velocity(value: Vector2D) {
        this.velocity = value.clone();
    }

    public get BoardWorldRotation(): number {
        return this.snowboard.WorldRotation;
    }

    public set BoardRotation(value: number) {
        this.snowboard.Rotation = value;
    }

    public get BodyWorldRotation(): number {
        return this.body.WorldRotation;
    }

    public set BodyRotation(value: number) {
        this.body.Rotation = value;
    }

    public get ShiftyInput(): number {
        return this.shiftyInput;
    }

    public get TurnInput(): number {
        return this.turnInput;
    }

    public get ShiftyTargetAngle(): number {
        return this.shiftyTargetAngle;
    }

    public set ShiftyTargetAngle(targetAngle: number) {
        this.shiftyTargetAngle = targetAngle;
    }

    public set ShiftyAngle(angle: number) {
        this.shiftyAngle = angle;
    }

    public get ShiftyAngle(): number {
        return this.shiftyAngle;
    }    

    public get ShiftyLerpSpeed(): number {
        return this.maxShiftyAngle;
    }

    public get MaxShiftyAngle(): number {
        return this.maxShiftyAngle;
    }

    public get VerticalVelocity(): number {
        return this.verticalVelocity;
    }

    public set VerticalVelocity(value: number) {
        this.verticalVelocity = value;
    }

    public get Height(): number {
        return this.height;
    }

    public set Height(value: number) {
        this.height = value;
    }

    public get RotationRate(): number {
        return this.rotationRate;
    }

    public set RotationRate(value: number) {
        this.rotationRate = value;
    }

    // #endregion
}
