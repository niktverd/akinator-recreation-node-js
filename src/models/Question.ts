type Question = {
    id: number;
    text: string;
    hidden_from_ui?: boolean;
    show_only_for_doctors?: boolean;
    possibility_of_this_is_next: number;
}

export default Question;