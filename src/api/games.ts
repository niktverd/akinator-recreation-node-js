import Game from "@/db/Game";

export const getList = () => {
    return Game.query().select();
}

type AddArgs = {
    user_id: number;
    is_finished: boolean;
    is_succeed: boolean;
};

export const add = ({
    user_id,
    is_finished,
    is_succeed,
}: AddArgs) => {
    return Game.query().insert({
        user_id,
        is_finished,
        is_succeed,
    });
}

export const remove = (id: number) => {
    return Game.query().deleteById(id);
}

type UpdateArgs = {
    id: number;
    user_id: number;
    is_finished: boolean;
    is_succeed: boolean;
};

export const update = ({
    id,
    user_id,
    is_finished,
    is_succeed,
}: UpdateArgs) => {
    return Game.query().updateAndFetchById(id, {
        user_id,
        is_finished,
        is_succeed,
    });
}
