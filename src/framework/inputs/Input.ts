import { InputType } from "./InputManager.ts";

/**
 * Abstract base class for different types of inputs.
 */
export abstract class Input<T> {
    private name: string;
    private type: InputType;
    private value: T;
    private listeners: Array<(newValue: T) => void> = [];

    constructor(name: string, type: InputType, defaultValue: T) {
        this.name = name;
        this.type = type;
        this.value = defaultValue;

        if (typeof document === "undefined") return;

        document.addEventListener("keydown", (event) => {
            this.onKeyDown(event.key);
        });

        document.addEventListener("keyup", (event) => {
            this.onKeyUp(event.key);
        });
    }

    /**
     * Function to be called when a key is pressed. Implementations should update the input's value accordingly.
     * @param key The key that was pressed.
     */
    abstract onKeyDown(key: string): void;

    /**
     * Function to be called when a key is released. Implementations should update the input's value accordingly.
     * @param key The key that was released.
     */
    abstract onKeyUp(key: string): void;
    
    /**
     * Subscribes a listener to value changes.
     * @param listener A function to be called when the input's value changes.
     * @returns A function to unsubscribe the listener.
    */
    public subscribe(listener: (newValue: T) => void): () => void {
       this.listeners.push(listener);
       // Return unsubscribe function
       return () => {
           this.listeners = this.listeners.filter((l) => l !== listener);
        };
    }
    
    /**
     * Notifies all subscribed listeners of a value change.
    */
   private notifyListeners() {
        for (const listener of this.listeners) {
            listener(this.value);
        }
    }

    /**
     * Sets the value and notifies listeners if the value has changed.
     * @param value The new value to set.
     */
    protected set Value(value: T) {
        if (this.value !== value) {
            this.value = value;
            this.notifyListeners();
        }
    }
    
    /**
     * @returns The current value of the input.
     */
    public get Value(): T {
        return this.value;
    }

    /**
     * @returns The name of the input.
     */
    public get Name(): string {
        return this.name;
    }

    /**
     * @returns The type of the input.
     */
    public get Type(): InputType {
        return this.type;
    }
}
