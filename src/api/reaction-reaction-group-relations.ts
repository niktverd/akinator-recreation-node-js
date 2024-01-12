import ReactionReactionGroupRelation from "@/db/ReactionReactionGroupRelation";

 export const getList = () => {
     return ReactionReactionGroupRelation.query().select();
 }

 type AddArgs = {
     reaction_id: number;
     reaction_group_id: number;
 };

 export const add = ({
     reaction_id,
     reaction_group_id,
 }: AddArgs) => {
     return ReactionReactionGroupRelation.query().insert({
         reaction_id,
         reaction_group_id,
     });
 }

 export const remove = (id: number) => {
     return ReactionReactionGroupRelation.query().deleteById(id);
 }

 type UpdateArgs = {
     id: number;
     reaction_id: number;
     reaction_group_id: number;
 };

 export const update = ({
     id,
     reaction_id,
     reaction_group_id,
 }: UpdateArgs) => {
     return ReactionReactionGroupRelation.query().updateAndFetchById(id, {
         reaction_id,
         reaction_group_id,
     });
 }