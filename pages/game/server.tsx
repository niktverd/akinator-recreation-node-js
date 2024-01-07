import { Navigation } from "@/components/Navigation/Navigation";
import { TestGameServer } from "@/components/TestGame/TestGameServer";

const Game = () => {
    return <div>
        <Navigation />
        <h1>Game</h1>
        <div>
            <TestGameServer />
        </div>
    </div>;
}

export default Game;
