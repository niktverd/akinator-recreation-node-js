import { Navigation } from "@/components/Navigation/Navigation";
import { SimpleRelationControl } from "@/components/SimpleRelationControl/SimpleRelationControl";

const Questions = () => {
    return <div>
        <Navigation />
        <h1>Questions Block</h1>
        <div>
            <SimpleRelationControl baseUrl="/api/question-block" />
        </div>
    </div>;
}

export default Questions;
