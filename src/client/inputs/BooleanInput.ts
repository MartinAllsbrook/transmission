import { Input } from './Input.ts';

export class BooleanInput extends Input<boolean> {
    keys: string[];
    pressedKeys: Set<string> = new Set();

    constructor(name: string, keys: string[]) {
        super(name, 'boolean', false);
        this.keys = keys;
    }

    override onKeyDown(key: string): void {
        if (this.keys.includes(key)) {
            this.pressedKeys.add(key);

            this.setValue(true);
        }
    }

    override onKeyUp(key: string): void {
        if (this.keys.includes(key)) {
            this.pressedKeys.delete(key);

            // Only set to false if no keys are pressed
            if (this.pressedKeys.size === 0)
                this.setValue(false);
        }
    }
}