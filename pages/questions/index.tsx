import { Navigation } from "@/components/Navigation/Navigation";
import { SimpleEntityControl } from "@/components/SimpleEntityControl/SimpleEntityControl";

const Questions = () => {
    return <div>
        <Navigation />
        <h1>Questions</h1>
        <div>
            <SimpleEntityControl baseUrl="/api/questions" />
        </div>
    </div>;
}

export default Questions;
