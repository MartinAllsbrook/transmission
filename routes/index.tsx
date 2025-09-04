import { useSignal } from "@preact/signals";
import Game from "../islands/Game.tsx";

export default function Home() {
    const count = useSignal(3);
    return (
        <div>
            <Game />
        </div>
    );
}
