import { Input } from "./Input.ts";

interface Vector2 {
    x: number;
    y: number;
}

export class VectorInput extends Input<Vector2> {
    upKeys: string[];
    upKeysSet: Set<string> = new Set();

    downKeys: string[];
    downKeysSet: Set<string> = new Set();

    leftKeys: string[];
    leftKeysSet: Set<string> = new Set();

    rightKeys: string[];
    rightKeysSet: Set<string> = new Set();

    constructor(
        name: string,
        upKeys: string[],
        downKeys: string[],
        leftKeys: string[],
        rightKeys: string[],
    ) {
        super(name, "vector", { x: 0, y: 0 });
        this.upKeys = upKeys;
        this.downKeys = downKeys;
        this.leftKeys = leftKeys;
        this.rightKeys = rightKeys;
    }

    override onKeyDown(key: string): void {
        if (this.upKeys.includes(key)) {
            this.upKeysSet.add(key);
        }

        if (this.downKeys.includes(key)) {
            this.downKeysSet.add(key);
        }

        if (this.leftKeys.includes(key)) {
            this.leftKeysSet.add(key);
        }

        if (this.rightKeys.includes(key)) {
            this.rightKeysSet.add(key);
        }

        this.updateValue();
    }

    override onKeyUp(key: string): void {
        if (this.upKeys.includes(key)) {
            this.upKeysSet.delete(key);
        }

        if (this.downKeys.includes(key)) {
            this.downKeysSet.delete(key);
        }

        if (this.leftKeys.includes(key)) {
            this.leftKeysSet.delete(key);
        }

        if (this.rightKeys.includes(key)) {
            this.rightKeysSet.delete(key);
        }

        this.updateValue();
    }

    private updateValue() {
        const newValue: Vector2 = {
            x: (this.rightKeysSet.size > 0 ? 1 : 0) -
                (this.leftKeysSet.size > 0 ? 1 : 0),
            y: (this.upKeysSet.size > 0 ? 1 : 0) -
                (this.downKeysSet.size > 0 ? 1 : 0),
        };

        this.setValue(newValue);
    }
}
