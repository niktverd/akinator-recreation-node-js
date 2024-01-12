import { Navigation } from "@/components/Navigation/Navigation";
import { SimpleEntityControl } from "@/components/SimpleEntityControl/SimpleEntityControl";

const Questions = () => {
    return <div>
        <Navigation />
        <h1>Reaction Groups</h1>
        <div>
            <SimpleEntityControl baseUrl="/api/reaction-groups" mainField="slug" />
        </div>
    </div>;
}

export default Questions;
