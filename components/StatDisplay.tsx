import { Component } from "preact";

export interface StatDisplayProps {
    name: string;
    value: number;
    highest: number;
    numDecimalPlaces?: number;
}

export class StatDisplay extends Component<StatDisplayProps> {
    override render() {
        const { name, value, highest } = this.props;
        const numDecimalPlaces = this.props.numDecimalPlaces ?? 1;

        return (
            <div class="flex flex-col items-left p-1 bg-white bg-opacity-50 rounded border border-black">
                <div class="text-black text-sm">
                    {name}:{" "}
                    <span class="font-bold">
                        {value.toFixed(numDecimalPlaces)}
                    </span>
                </div>
                <div class="text-gray-400 text-xs">
                    Best:{" "}
                    <span class="font-bold">
                        {highest.toFixed(numDecimalPlaces)}
                    </span>
                </div>
            </div>
        );
    }
}
