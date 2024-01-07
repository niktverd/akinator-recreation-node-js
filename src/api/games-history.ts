import GameHistory from "@/db/GameHistory";

export const getList = () => {
    return GameHistory.query().select();
}

type AddArgs = {
    game_id: number;
    user_id: number;
    answer_id: number;
    approved_by_moderator: number;
};

export const add = ({
    game_id,
    user_id,
    answer_id,
    approved_by_moderator = 1,
}: AddArgs) => {
    return GameHistory.query().insert({
        game_id,
        user_id,
        answer_id,
        approved_by_moderator,
    });
}

export const remove = (id: number) => {
    return GameHistory.query().deleteById(id);
}

type UpdateArgs = {
    id: number;
    game_id: number;
    user_id: number;
    answer_id: number;
    approved_by_moderator: number;
};

export const update = ({
    id,
    game_id,
    user_id,
    answer_id,
    approved_by_moderator = 1,
}: UpdateArgs) => {
    return GameHistory.query().updateAndFetchById(id, {
        game_id,
        user_id,
        answer_id,
        approved_by_moderator,
    });
}
