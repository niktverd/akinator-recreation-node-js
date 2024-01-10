import QuestionRelease from "@/db/QuestionRelease";

export const getList = () => {
    return QuestionRelease.query().select();
}

type AddArgs = {
    asked_question_id: number;
    released_question_id: number;
};

export const add = ({
    asked_question_id,
    released_question_id,
}: AddArgs) => {
    return QuestionRelease.query().insert({
        asked_question_id,
        released_question_id,
    });
}

export const remove = (id: number) => {
    return QuestionRelease.query().deleteById(id);
}

type UpdateArgs = {
    id: number;
    asked_question_id: number;
    released_question_id: number;
};

export const update = ({
    id,
    asked_question_id,
    released_question_id,
}: UpdateArgs) => {
    return QuestionRelease.query().updateAndFetchById(id, {
        asked_question_id,
        released_question_id,
    });
}
