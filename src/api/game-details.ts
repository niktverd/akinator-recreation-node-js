import GameDetail from "@/db/GameDetail";

export const getList = () => {
    return GameDetail.query().select();
}

type GetAnswerQuestionPopularityArgs = {
    answer_id: number;
    question_id: number;
};

export const getAnswerQuestionPopularity = ({answer_id, question_id}: GetAnswerQuestionPopularityArgs) => {
    return GameDetail.query().select()
        .innerJoin('gameHistory', 'gameDetails.game_id', 'gameHistory.game_id')
        .where({answer_id})
        .andWhere({question_id})
        .count();
}

type GetAnswerQuestionReactionPopularityArgs = {
    answer_id: number;
    question_id: number;
    reaction_id: number;
};

export const getAnswerQuestionReactionPopularity = ({
    answer_id,
    question_id,
    reaction_id,
}: GetAnswerQuestionReactionPopularityArgs) => {
    return GameDetail.query().select()
        .innerJoin('gameHistory', 'gameDetails.game_id', 'gameHistory.game_id')
        .where({answer_id})
        .andWhere({question_id})
        .andWhere({reaction_id})
        .count();
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
    return GameDetail.query().insert({
        game_id,
        question_id,
        reaction_id,
    });
}

export const remove = (id: number) => {
    return GameDetail.query().deleteById(id);
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
    return GameDetail.query().updateAndFetchById(id, {
        game_id,
        question_id,
        reaction_id,
    });
}
