import { SATCollider } from "framework";
import { Body } from "../Body.ts";
import { Head } from "../Head.ts";
import { Board } from "../Board.ts";
import { Player } from "../Player.ts";

export type StateName = "ground" | "air" | "rail";

export abstract class PlayerState {
    public abstract get StateName(): StateName;

    protected player: Player;
    protected body: Body;
    protected head: Head;
    protected board: Board;

    constructor(player: Player) {
        this.player = player;

        // Get components
        this.body = player.getChildrenByName("Body")[0] as Body;
        if (!this.body) throw new Error("PlayerState: Player is missing Body component");
        this.head = this.body.getChildrenByName("Head")[0] as Head;
        if (!this.head) throw new Error("PlayerState: Body is missing Head component");
        this.board = player.getChildrenByName("Board")[0] as Board;
        if (!this.board) throw new Error("PlayerState: Player is missing Board component");
    }

    public enter(): void {}
    
    public update(_deltaTime: number): void {}
    
    public exit(): void {}

    public onCollisionEnter(_other: SATCollider): void {}

    public onCollisionStay(_other: SATCollider): void {}

    public onCollisionExit(_other: SATCollider): void {}
}