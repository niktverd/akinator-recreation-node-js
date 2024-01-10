import Question from "@/db/Question";
import QuestionRelease from "@/db/QuestionRelease";

export const getList = () => {
    return Question.query().select();
}

export const getBasicList = () => {
    return Question.query().select()
        .whereNotIn('id', QuestionRelease.query().select('released_question_id'))
}

export const getReleasedList = (reactedQuestionsList: number[]) => {
    return Question.query()
        .select()
        .join('question_release as ms', 'questions.id', 'ms.released_question_id')
        .leftJoin('question_block as bq', 'questions.id', 'bq.blocked_question_id')
        .whereIn('ms.asked_question_id', reactedQuestionsList)
        .whereNull('bq.blocked_question_id');
}

type AddArgs = {
    text: string;
    hidden_from_ui: boolean;
    shown_only_for_doctors: boolean;
    possibility_of_this_is_next: number;
};

export const add = ({
    text,
    hidden_from_ui = false,
    shown_only_for_doctors = false,
    possibility_of_this_is_next = 0,
}: AddArgs) => {
    return Question.query().insert({
        text,
        hidden_from_ui,
        shown_only_for_doctors,
        possibility_of_this_is_next,
    });
}

export const remove = (id: number) => {
    return Question.query().deleteById(id);
}

type UpdateArgs = {
    id: number;
    text: string;
};

export const update = ({
    id,
    text,
}: UpdateArgs) => {
    return Question.query().updateAndFetchById(id, {
        text,
    });
}
