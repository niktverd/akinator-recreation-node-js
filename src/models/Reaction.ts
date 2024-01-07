export type Reaction = {
    Yes: number;
    No: number;
    CloserYesThanNo: number;
    CloserNoThanYes: number;
    IdontKnow: number;
    DoesNotMakeSence: number;
};

export const ReactionEnt: Reaction = {
    Yes: 0,
    No: 1,
    CloserYesThanNo: 2,
    CloserNoThanYes: 3,
    IdontKnow: 4,
    DoesNotMakeSence: 5,
};