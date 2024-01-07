import QuestionReaction from "@/db/QuestionReaction";

export const getList = (game_id: number | undefined) => {
    const listQuery = QuestionReaction.query().select();

    if (game_id) {
        listQuery.where({game_id});
    }

    return listQuery;
}

type AddArgs = {
    game_id: number;
    question_id: number;
    reaction_id: number;
};

export const add = ({
    game_id,
    question_id,
    reaction_id,
}: AddArgs) => {
    return QuestionReaction.query().insert({
        game_id,
        question_id,
        reaction_id,
    });
}

export const remove = (id: number) => {
    return QuestionReaction.query().deleteById(id);
}

type UpdateArgs = {
    id: number;
    game_id: number;
    question_id: number;
    reaction_id: number;
};

export const update = ({
    id,
    game_id,
    question_id,
    reaction_id,
}: UpdateArgs) => {
    return QuestionReaction.query().updateAndFetchById(id, {
        game_id,
        question_id,
        reaction_id,
    });
}
