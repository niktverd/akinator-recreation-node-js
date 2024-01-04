import GameDetail from "@/db/GameDetail";

class DbGameDetailsEditor {
    constructor() {

    }

    Get = async () => {
        return GameDetail.query().select();
    }

    Add = async (game_id: number, question_id: number, reaction_id: number) => {
        GameDetail.query().insert({
            game_id,
            question_id,
            reaction_id,
        });
    }

    QuestionAskedWhenThinkAboutAnswer = async ({answer_id, question_id}: {answer_id: number, question_id: number}) => {
        /* return _db.SingleOrDefault<int>(
            $"SELECT Count(*) FROM {_tblGdetails} 
            INNER JOIN {_tblGhistory} ON ({_tblGdetails}.game_id = {_tblGhistory}.game_id) 
            WHERE answer_id = {answerId}  AND question_id = {questionId}"); */
        return await GameDetail.query().select('gameDetails.*')
            .innerJoin('gameHistory', 'gameDetails.game_id', 'gameHistory.game_id')
            .where({answer_id})
            .andWhere({question_id})
            .count();
    }

    QuestionReactionCountWhenThinkAboutAnswer = async ({reaction, answer_id, question_id}: {reaction: number, answer_id: number, question_id: number}) => {
        /* 
         var query =
            $"SELECT Count(*) FROM {_tblGdetails} 
                INNER JOIN {_tblGhistory} ON ({_tblGdetails}.game_id = {_tblGhistory}.game_id) 
                WHERE question_id = {q.Id} AND reaction_id = {(int) react} AND answer_id={ans.Id}";

        */
        return await GameDetail.query().select('gameDetails.*')
            .innerJoin('gameHistory', 'gameDetails.game_id', 'gameHistory.game_id')
            .where({answer_id})
            .andWhere({question_id})
            .andWhere({reaction_id: reaction})
            .count();
    }

    GeneralReactionCountForExactQuestion = async ({reaction, question_id}: {reaction: number, question_id: number}) => {
        /* 
        return _db.SingleOrDefault<int>(
            $"SELECT Count(*) 
            FROM {_tblGdetails} 
            WHERE question_id = {q.Id} AND
            reaction_id = {(int)react}");

        */
        return await GameDetail.query().select('gameDetails.*')
            .where({question_id})
            .andWhere({reaction_id: reaction})
            .count();
    }

    // Remove = async (GameDetailId: number) => {
    //     await GameDetail.query().delete().where({id: GameDetailId});
    // }

    // UpdateOnDbSide = async (GameDetailId: number, GameDetailText: string) => {
    //     GameDetail.query().update({text: GameDetailText}).where({id: GameDetailId});
    // }

}

export default DbGameDetailsEditor;