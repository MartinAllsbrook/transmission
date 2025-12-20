import { Signal } from "@preact/signals";

export class StatTracker {
    private stat: Signal<number> = new Signal(0);
    private higestStat: Signal<number> = new Signal(0);

    constructor() {
        this.stat.value = 0;
        this.higestStat.value = 0;
    }

    public set Value(newValue: number) {
        this.stat.value = newValue;
        if (newValue > this.higestStat.value) {
            this.higestStat.value = newValue;
        }
    }

    public get Value() {
        return this.stat.value;
    }

    public get HigestValue() {
        return this.higestStat.value;
    }

    public get Stat() {
        return this.stat;
    }

    public get HigestStat() {
        return this.higestStat;
    }
}
