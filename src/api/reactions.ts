import Reaction from "@/db/Reaction";

export const getList = () => {
    return Reaction.query().select();
}

type AddArgs = {
    slug: string;
};

export const add = ({
    slug,
}: AddArgs) => {
    return Reaction.query().insert({
        slug,
    });
}

export const remove = (id: number) => {
    return Reaction.query().deleteById(id);
}

type UpdateArgs = {
    id: number;
    slug: string;
};

export const update = ({
    id,
    slug,
}: UpdateArgs) => {
    return Reaction.query().updateAndFetchById(id, {
        slug,
    });
}

export const getReactionsByQuestionId = (questionId: number) => {
    return Reaction.query().select(['reactions.*'])
        .innerJoin('reaction-reaction-group-relations', 'reaction-reaction-group-relations.reaction_id', 'reactions.id')
        .innerJoin('questions', 'questions.reaction_group', 'reaction-reaction-group-relations.reaction_group_id')
        .where({'questions.id': questionId});
}
