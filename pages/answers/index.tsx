import { Navigation } from "@/components/Navigation/Navigation";
import { SimpleEntityControl } from "@/components/SimpleEntityControl/SimpleEntityControl";

const Answers = () => {
    return <div>
        <Navigation />
        <h1>Answers</h1>
        <div>
            <SimpleEntityControl baseUrl="/api/answers" />
        </div>
    </div>;
}

export default Answers;
