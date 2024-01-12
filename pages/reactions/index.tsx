import { Navigation } from "@/components/Navigation/Navigation";
import { SimpleEntityControl } from "@/components/SimpleEntityControl/SimpleEntityControl";

const Questions = () => {
    return <div>
        <Navigation />
        <h1>Reactions</h1>
        <div>
            <SimpleEntityControl baseUrl="/api/reactions" mainField="slug" />
        </div>
    </div>;
}

export default Questions;
