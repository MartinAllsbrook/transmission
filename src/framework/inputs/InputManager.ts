import { BooleanInput } from "./BooleanInput.ts";
import { ValueInput } from "./ValueInput.ts";

export type InputType = "boolean" | "value" | "vector";

type InputMap = {
    jump: BooleanInput;
    turn: ValueInput;
    shifty: ValueInput;
    restart: BooleanInput;
    // Add other inputs here as needed, e.g. move: ValueInput;
};

// Depricated: Use Player class inputs instead
export class InputManager {
    private static inputs: { [K in keyof InputMap]: InputMap[K] } = {
        jump: new BooleanInput("jump", [" ", "w", "ArrowUp"]),
        turn: new ValueInput("turn", ["d"], ["a"]),
        shifty: new ValueInput("shifty", ["ArrowRight"], ["ArrowLeft"]),
        restart: new BooleanInput("restart", ["r"]),
    };

    public static getInput<K extends keyof InputMap>(name: K): InputMap[K] {
        return this.inputs[name];
    }
}
