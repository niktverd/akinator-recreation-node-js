import { Navigation } from "@/components/Navigation/Navigation";
import { SimpleRelationControl } from "@/components/SimpleRelationControl/SimpleRelationControl";

 const Relation = () => {
     return <div>
         <Navigation />
         <h1>Reaction to Reaction group Relation</h1>
         <div>
             <SimpleRelationControl baseUrl="/api/reaction-reaction-group-relations" />
         </div>
     </div>;
 }

 export default Relation;