import Question from "@/db/Question";


class DbQuestionsEditor {
    constructor() {

    }

    Get = async () => {
        return Question.query().select();
    }

    Add = async (question: string) => {
        const {id} = await Question.query().insert({
            text: question,
            is_doctor: false,
            shown_only_for_doctors: false,
        }).returning('id');

        return id;
    }

    Remove = async (questionId: number) => {
        await Question.query().delete().where({id: questionId});
    }

    UpdateOnDbSide = async (questionId: number, questionText: string) => {
        Question.query().update({text: questionText}).where({id: questionId});
    }

}

export default DbQuestionsEditor;