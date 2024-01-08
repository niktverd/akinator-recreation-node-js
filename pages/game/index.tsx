import { Navigation } from "@/components/Navigation/Navigation";
import { TestGameClient } from "@/components/TestGame/TestGameClient";

const Game = () => {
    return <div>
        <Navigation />
        <h1>Game</h1>
        <div>
            <TestGameClient />
        </div>
    </div>;
}

export default Game;
