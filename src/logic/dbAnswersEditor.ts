import Answer from "@/db/Answer";
import AnswerType from "@/models/Answer";
class DbAnswersEditor {
    constructor() {

    }

    Get = async () => {
        const answers = await Answer.query().select();

        return answers.map((answer) => {
            answer.countOfGamesWhenWasAsTarget = answer.countOfGamesWhenWasAsTarget || 1;
        }) as unknown as AnswerType[];
    }

    Add = async (answer: string) => {
        Answer.query().insert({
            text: answer,
        });
    }

    Remove = async (answerId: number) => {
        await Answer.query().delete().where({id: answerId});
    }

    UpdateOnDbSide = async (answerId: number, answerText: string) => {
        Answer.query().update({text: answerText}).where({id: answerId});
    }

}

export default DbAnswersEditor;