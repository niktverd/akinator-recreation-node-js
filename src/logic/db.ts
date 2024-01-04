import Question from "@/models/Question";
import Answer from "@/models/Answer";

import DbQuestionsEditor from "./dbQuestionsEditor";
import DbAnswersEditor from "./dbAnswersEditor";
import DbGameHistoryEditor from "./dbGameHistoryEditor";
import DbUsersEditor from "./dbUserEditor";
import DbGameDetailsEditor from "./dbGameDetailsEditor";

export type User = {
    id: number,
    login: string;
    isDoctor?: boolean;
}

export type GameHistory = Record<number, Reaction>;

class Db {
    private dbQuestionsEditor = new DbQuestionsEditor();
    private dbGameHistoryEditor = new DbGameHistoryEditor();
    private dbAnswersEditor = new DbAnswersEditor();
    private dbUsersEditor = new DbUsersEditor();
    private dbGameDetailsEditor = new DbGameDetailsEditor();

    public QuestionAdd = async ({text}: Question) => {
        return await this.dbQuestionsEditor.Add(text);
    }

    public AnswerAdd = async ({text}: Answer) => {
        return await this.dbAnswersEditor.Add(text);
    }

    public QuestionRemove = async ({id: questionId}: Question) => {
       await this.dbQuestionsEditor.Remove(questionId)
       await this.dbGameHistoryEditor.Remove({questionId})
    }

    public QuestionUpdateOnDbSide = async ({id, text}: Question) => {
        await this.dbQuestionsEditor.UpdateOnDbSide(id, text);
    }

    public AnswerUpdateOnDbSide = async ({id, text}: Answer) => {
        await this.dbAnswersEditor.UpdateOnDbSide(id, text);
    }

    public AnswerRemove = async ({id: answerId}: Answer) => {
        await this.dbAnswersEditor.Remove(answerId);
        await this.dbGameHistoryEditor.Remove({answerId})
    }
    
    public QuestionsGetAll = async () => {
        return await this.dbQuestionsEditor.Get();
    }

    public AnswersGetAll = async () => {
        return await this.dbAnswersEditor.Get();
    }

    public CountOfGames = async () => {
        return await this.dbGameHistoryEditor.CountOfGames();
    }

    public GameAdd = async (user: User, answ: Answer, gameHistory: GameHistory) => {
        const gh = await this.dbGameHistoryEditor.Add({
            game_id: Math.random(),
            user_id: user.id,
            answer_id: answ.id,
        });

        for(const [question_id, reaction] of Object.entries(gameHistory)) {
            this.dbGameDetailsEditor.Add(gh.id, Number(question_id), reaction);
        }
    }

    public UserAdd = async (login: string, is_doctor: boolean) => {
        this.dbUsersEditor.Add(login, is_doctor);
    }

    public GetUserById = async (userId: number) => {
        return this.dbUsersEditor.GetById(userId);
    }

//     public User GetFirstUser() {
//         foreach (var a in _db.Query<User>($"SELECT * FROM {_tblUsrs}"))
//  {
//             return a;
//         }

//         return new User();
//     }

    // public QuestionAskedWhenThinkAboutAnswer = (q: Question, ans: Answer) => {
    //     return QuestionAskedWhenThinkAboutAnswer(q.Id, ans.Id);
    // }


    public QuestionAskedWhenThinkAboutAnswer = (question_id: number, answer_id: number) => {
        return this
            .dbGameDetailsEditor
            .QuestionAskedWhenThinkAboutAnswer({question_id, answer_id});
    }

    public QuestionReactionCountWhenThinkAboutAnswer(q: Question, react: Reaction, ans: Answer) {
        return this
            .dbGameDetailsEditor
            .QuestionReactionCountWhenThinkAboutAnswer({
                reaction: react,
                question_id: q.id,
                answer_id: ans.id
            });
    }


    public GeneralReactionCountForExactQuestion = (react: Reaction, q: Question) => {
        return this
            .dbGameDetailsEditor
            .GeneralReactionCountForExactQuestion({
                reaction: react,
                question_id: q.id,
            });
    }

}

export default Db;