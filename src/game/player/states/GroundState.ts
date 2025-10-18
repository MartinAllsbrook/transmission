import { SATCollider, ExtraMath, Vector2D } from "framework";
import { PlayerState, StateName } from "./PlayerState.ts";
import { PLAYER_CONFIG } from "../PlayerConfig.ts";

export class GroundState extends PlayerState {
    private switchToAir: boolean = false;

    public override enter(): void {
        this.switchToGroundShifty();
        // this.tricksManager.endSpin(
        //     this.board.Transform.WorldRotation, 
        //     this.velocity.heading() * 180 / Math.PI
        // );
    }

    private switchToGroundShifty() {
        // Rotation of the root object now matches the board
        this.player.Transform.Rotation = this.board.Transform.WorldRotation;

        // Rotation of the body is now offset to match the now flipped shifty. 90 is for the base stance of the body 
        this.body.Transform.Rotation.Deg = (this.player.ShiftyAngle.Deg * -1) + 90; 

        // Reset board rotation because it is now handled by the root object
        this.board.Transform.Rotation.Deg = 0; 
    }

    // #region Update

    public override update(_deltaTime: number): void {
        this.shiftyUpdate(_deltaTime);
        this.physicsUpdate(_deltaTime);
    }

    protected shiftyUpdate(deltaTime: number): void {
        const shiftyTargetAngle = this.player.ShiftyInput.Value * PLAYER_CONFIG.shiftyMaxAngle;
        this.player.ShiftyAngle.Deg = ExtraMath.lerpSafe(
            this.player.ShiftyAngle.Deg, 
            shiftyTargetAngle, 
            PLAYER_CONFIG.shiftyLerpSpeed * deltaTime
        );
        
        this.body.Transform.Rotation = (this.shiftyAngle * -1) + 90; // Flip for goofy
    }

    protected physicsUpdate(deltaTime: number): void {
        // Apply gravity
        this.velocity.y += PLAYER_CONFIG.gravityStrength * deltaTime

        // Rotate
        this.deltaRotation += (this.inputs.turn - this.deltaRotation) * deltaTime * 10;
        
        const radians = (this.board.Transform.WorldRotation) * (Math.PI / 180);

        // Normal force
        const forward = Vector2D.fromAngle(radians - Math.PI / 2);
        const direction = this.velocity.normalize();
        const projected = direction.projectOnto(forward);
        const normal = projected.subtract(direction);

        const strength = Math.pow((1 - normal.magnitude()), 2) * 0.25 + 1;
        const normalDirection = projected.subtract(direction).normalize().multiply(strength);

        this.velocity = this.velocity.add(normalDirection.multiply(deltaTime * PLAYER_CONFIG.slipStrength));

        // Friction
        this.velocity = this.velocity.multiply(1 - PLAYER_CONFIG.frictionStrength * deltaTime);

        this.player.Transform.Rotation += this.deltaRotation * deltaTime * PLAYER_CONFIG.rotationSpeed;

        // Update position
        this.player.Transform.Position.set(
            this.player.Transform.Position.add(this.velocity.multiply(deltaTime)),
        );
    }

    protected override checkTransitions(): StateName | void {
        if (this.switchToAir) {
            this.switchToAir = false;
            return "air";
        }
        if (this.inputs.jump) {
            this.deltaHeight += PLAYER_CONFIG.jumpStrength;
            return "air";
        }
    }

    public override get StateName(): StateName {
        return "ground";
    }

    // #endregion

    //#region Collisions

    // public override onCollisionEnter(other: SATCollider): void {
    //     if (other.layer === "obstacle") {
    //         Game.endGame("You crashed into an tree, watch out!");
    //     }

    //     if (other.layer === "jump") {
    //         // TODO: I wonder if there's a better way to handle this
    //         // This is adding vertical speed but it wont be used until we enter the air state
    //         this.deltaHeight = this.velocity.magnitude() * 0.0075;
    //     }

    //     if (other.layer === "rail") {
    //         Game.endGame("You crashed into a rail, jump to get onto rails!");
    //     }
    // }

    // public override onCollisionExit(_other: SATCollider): void {
    //     this.switchToAir = true;
    // }

    //#endregion
}