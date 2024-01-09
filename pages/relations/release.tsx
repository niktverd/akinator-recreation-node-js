import { Navigation } from "@/components/Navigation/Navigation";
import { SimpleRelationControl } from "@/components/SimpleRelationControl/SimpleRelationControl";

const Questions = () => {
    return <div>
        <Navigation />
        <h1>Questions Release</h1>
        <div>
            <SimpleRelationControl baseUrl="/api/question-release" />
        </div>
    </div>;
}

export default Questions;
