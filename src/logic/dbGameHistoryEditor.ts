import Answer from "@/db/Answer";
import GameHistory from "@/db/GameHistory";

class DbGameHistoryEditor {
    constructor() {

    }

    Get = async () => {
        return GameHistory.query().select();
    }

    Add = async ({game_id, user_id, answer_id}: {game_id: number, user_id: number, answer_id: number}) => {
        return await GameHistory.query().insert({
            game_id,
            user_id,
            answer_id,
            approved_by_moderator: 0,
        }).returning('id');
    }

    Remove = async ({answerId, questionId}: {answerId?: number; questionId?: number}) => {
        if (answerId) {
            await GameHistory.query().delete().where({answer_id: answerId});
        }

        if (questionId) {
            await GameHistory.query().delete().where({question_id: questionId});
        }
    }

    // UpdateOnDbSide = async (answerId: number, answerText: string) => {
    //     Answer.query().update({text: answerText}).where({id: answerId});
    // }

    CountOfGames = async () => {
        return await GameHistory.query().select('*').count();
    }

}

export default DbGameHistoryEditor;