import ReactionGroup from "@/db/ReactionGroup";

export const getList = () => {
    return ReactionGroup.query().select();
}

type AddArgs = {
    slug: string;
};

export const add = ({
    slug,
}: AddArgs) => {
    return ReactionGroup.query().insert({
        slug,
    });
}

export const remove = (id: number) => {
    return ReactionGroup.query().deleteById(id);
}

type UpdateArgs = {
    id: number;
    slug: string;
};

export const update = ({
    id,
    slug,
}: UpdateArgs) => {
    return ReactionGroup.query().updateAndFetchById(id, {
        slug,
    });
}
