import Answer from "@/db/Answer";

export const getList = () => {
    return Answer.query().select();
}

type AddArgs = {
    text: string;
};

export const add = ({
    text,
}: AddArgs) => {
    return Answer.query().insert({
        text,
    });
}

export const remove = (id: number) => {
    return Answer.query().deleteById(id);
}

type UpdateArgs = {
    id: number;
    text: string;
};

export const update = ({
    id,
    text,
}: UpdateArgs) => {
    return Answer.query().updateAndFetchById(id, {
        text,
    });
}
