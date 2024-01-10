import QuestionBlock from "@/db/QuestionBlock";

export const getList = () => {
    return QuestionBlock.query().select();
}

type AddArgs = {
    answered_question_id: number;
    blocked_question_id: number;
};

export const add = ({
    answered_question_id,
    blocked_question_id,
}: AddArgs) => {
    return QuestionBlock.query().insert({
        answered_question_id,
        blocked_question_id,
    });
}

export const remove = (id: number) => {
    return QuestionBlock.query().deleteById(id);
}

type UpdateArgs = {
    id: number;
    answered_question_id: number;
    blocked_question_id: number;
};

export const update = ({
    id,
    answered_question_id,
    blocked_question_id,
}: UpdateArgs) => {
    return QuestionBlock.query().updateAndFetchById(id, {
        answered_question_id,
        blocked_question_id,
    });
}
