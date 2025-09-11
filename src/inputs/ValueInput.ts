import { Input } from "./Input.ts";

export class ValueInput extends Input<number> {
    positiveKeys: string[];
    positiveKeysPressed: Set<string> = new Set();

    negativeKeys: string[];
    negativeKeysPressed: Set<string> = new Set();

    constructor(name: string, positiveKeys: string[], negativeKeys: string[]) {
        super(name, "value", 0);
        this.positiveKeys = positiveKeys;
        this.negativeKeys = negativeKeys;
    }

    override onKeyDown(key: string): void {
        if (this.positiveKeys.includes(key)) {
            this.positiveKeysPressed.add(key);
        }

        if (this.negativeKeys.includes(key)) {
            this.negativeKeysPressed.add(key);
        }

        this.updateValue();
    }

    override onKeyUp(key: string): void {
        if (this.positiveKeys.includes(key)) {
            this.positiveKeysPressed.delete(key);
        }

        if (this.negativeKeys.includes(key)) {
            this.negativeKeysPressed.delete(key);
        }

        this.updateValue();
    }

    private updateValue() {
        // Value is -1, 0, or 1 based on key presses
        const newValue = (this.positiveKeysPressed.size > 0 ? 1 : 0) -
            (this.negativeKeysPressed.size > 0 ? 1 : 0);
        this.setValue(newValue);
    }
}
