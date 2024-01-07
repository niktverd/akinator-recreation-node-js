import Question from "@/db/Question";

export const getList = async () => {
    return Question.query().select();
}

type AddArgs = {
    text: string;
    hidden_from_ui: boolean;
    shown_only_for_doctors: boolean;
    possibility_of_this_is_next: number;
};

export const add = async ({
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
