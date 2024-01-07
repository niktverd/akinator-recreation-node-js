import { Navigation } from "@/components/Navigation/Navigation";
import { SimpleEntityControl } from "@/components/SimpleEntityControl/SimpleEntityControl";

const Questions = () => {
    return <div>
        <Navigation />
        <h1>Games</h1>
        <div>
            <SimpleEntityControl baseUrl="/api/games" add={false} update={false} />
        </div>
    </div>;
}

export default Questions;
