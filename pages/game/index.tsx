import { Navigation } from "@/components/Navigation/Navigation";
import { TestGame } from "@/components/TestGame/TestGame";

const Game = () => {
    return <div>
        <Navigation />
        <h1>Game</h1>
        <div>
            <TestGame />
        </div>
    </div>;
}

export default Game;
