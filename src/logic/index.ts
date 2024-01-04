import Question from "@/models/Question";
import DbAnswerEditor from "./dbAnswersEditor";
import DbQuestionsEditor from "./dbQuestionsEditor";
import Answer from "@/models/Answer";
import Db, { GameHistory } from "./db";
import Fuzz from '../fuzzy-logic/fuzz';

enum ApriorAnswerPossibilityType {
    Standard,
    Intelligent,
};

class GameLogic {
    private db: Db = new Db();
    
    private Questions: DbQuestionsEditor = new DbQuestionsEditor();
    private Answers: DbAnswerEditor = new DbAnswerEditor();

    public apriorAnswerPossibilityType: ApriorAnswerPossibilityType = ApriorAnswerPossibilityType.Intelligent;
    public questionAndReactionHistory: GameHistory  = {};


    public QuestionsAll: Array<Question> = [];
    public AnswersAll: Array<Answer> = [];

    private fuzz = new Fuzz();

    QuestionsNotAsked = this.QuestionsAll.filter((q) => {
        return Boolean(this.questionAndReactionHistory[q.id]);
    })

    AnswerOnQuestion = (q: Question, react: Reaction) => {
        this.questionAndReactionHistory[q.id] = react;
    }

    GameLogic = async () => {
        this.Questions = new DbQuestionsEditor();
        this.UpdateQandA();
    }

    UpdateQandA = async () => {
        this.QuestionsAll = await this.Questions.Get();
        // QuestionsAll = Db.QuestionsGetAll();
        // AnswersAll = Db.AnswersGetAll();
        this.AnswersAll = await this.Answers.Get();
        await this.CalcPossibilities();
    }

    CalcPossibilities = async () => {
        await this.CalcAnswersPossibilityAndSortByIt();
        await this.CalcQuestionIsNextPossibility();
    }

    CalcAnswersPossibilityAndSortByIt = async () => {
        this.AnswersAll.forEach(async (answ) => {
            answ.possibility = await this.CalcCurrAnswerPossibility(answ);
        })

        this.AnswersAll = this.AnswersAll.sort((a, b) => (a.possibility - b.possibility));
    }

    CalcQuestionIsNextPossibility = async () => {
        if (this.QuestionsNotAsked.length == 0 || this.AnswersAll.length === 0) {
            return;
        }

        let answersWithMaxPoss = this.AnswersAll[0];

        this.QuestionsNotAsked.forEach((q) =>
        {
            let maxChangeOfPossibility = 0;

            const diffPosForReactions: number[] = [];

            Object.keys(Reaction).forEach(async (react) => {
                var tmp = await this.ExactReactionOnQuestionRelativelyAnswerPossibility(react, q, answersWithMaxPoss);
    
                diffPosForReactions.push(tmp);
            });
            {
            }

            q.possibilityOfThisIsNext = this.fuzz.Or(diffPosForReactions);
        });

        this.QuestionsAll = this.QuestionsAll.sort((a, b ) => a.possibilityOfThisIsNext - b.possibilityOfThisIsNext);
    }

    ExactReactionOnQuestionRelativelyAnswerPossibility = async (react: string, q: Question, answersWithMaxPoss: Answer) => {
        return 1;
    }

    ForceGameFinishWithAnswer =  async (ans: Answer) =>{
        var currUsr = await this.db.GetUserById(1);
        if (currUsr) {
            this.db.GameAdd(currUsr, ans, this.questionAndReactionHistory);
    
            this.ForceNewGame();
        }
    }


    ForceNewGame = async () => {
        this.questionAndReactionHistory = {};
        this.CalcPossibilities();
    }

    CalcCurrAnswerPossibility = async (answer: Answer) => {
        if (Object.keys(this.questionAndReactionHistory).length == 0)
        {
            return this.CalcApriorAnswerPossibility(answer);
        }

        const Bj: number[] = [];

        for(let pair in this.questionAndReactionHistory) {
            var react = this.questionAndReactionHistory[pair];
            var question = this.QuestionsAll.find((q) => q.id === Number(pair));

            if (question) {
                const rezPossibil = await this.ExactReactionOnQuestionRelativelyAnswerPossibility(react as unknown as string, question, answer);
                Bj.push(rezPossibil);
            }


        }

        var rez = this.fuzz.Or(Bj);

        return rez;
    }

    CalcApriorAnswerPossibility = async (answer: Answer) =>{
        if (this.apriorAnswerPossibilityType == ApriorAnswerPossibilityType.Standard) {
            return 1.0 / this.AnswersAll.length;
        } else if (this.apriorAnswerPossibilityType == ApriorAnswerPossibilityType.Intelligent) {
            const gamesCount = await this.db.CountOfGames() as unknown as number;

            if (gamesCount === 0)
                return 1;

            return answer.countOfGamesWhenWasAsTarget / gamesCount;
        }

        return 0;
    }
};

export default GameLogic;