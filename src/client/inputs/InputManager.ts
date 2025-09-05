import { BooleanInput } from "./BooleanInput.ts";
import { Input } from "./Input.ts";
import { ValueInput } from "./ValueInput.ts";

export type InputType = 'boolean' | 'value' | 'vector';

type InputMap = {
    jump: BooleanInput;
    turn: ValueInput;
    // Add other inputs here as needed, e.g. move: ValueInput;
};

export class InputManager {
    private static inputs: { [K in keyof InputMap]: InputMap[K] } = {
        jump: new BooleanInput('jump', [' ', 'w', 'ArrowUp']),
        turn: new ValueInput('turn', ['ArrowRight', 'd'], ['ArrowLeft', 'a']),
    };

    public static getInput<K extends keyof InputMap>(name: K): InputMap[K]['value'] {
        return this.inputs[name].value;
    }
}

