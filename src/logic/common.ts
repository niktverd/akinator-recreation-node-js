import Fuzz from "@/fuzzy-logic/fuzz";
import Answer from "@/models/Answer";
import Question from "@/models/Question";
import { ReactionEnt } from "@/models/Reaction";
import { GameHistory } from "./db";
import { ApriorAnswerPossibilityType } from "@/common/types";
import Helper from "@/fuzzy-logic/Helper";
import axios from 'axios';

const fuzz = new Fuzz();
const helper = new Helper();

export const Algorithm = {
    ReactionCountWhenThinkAboutAnswer: 'ReactionCountWhenThinkAboutAnswer',
    TimesAskedWhenThinkAbout: 'TimesAskedWhenThinkAbout',
    SaveGameDetails: 'SaveGameDetails',
};

type CalcPossibilitiesArgs = CalcQuestionIsNextPossibilityArgs
& CalcAnswersPossibilityAndSortByItArgs
& {
    answersAll: Answer[],
};

export const calcPossibilities = async ({
    answersAll,
    questionsNotAsked,
    ...rest
}: CalcPossibilitiesArgs) => {
    const sortedAnswersAll = await calcAnswersPossibilityAndSortByIt({...rest, answersAll});
    const nextQuestion = await calcQuestionIsNextPossibility({
        answersAll: sortedAnswersAll,
        questionsNotAsked,
    });

    console.log({sortedAnswersAll});
    return [nextQuestion, sortedAnswersAll];
}

type CalcAnswersPossibilityAndSortByItArgs = Omit<CalcCurrAnswerPossibilityArgs, 'answer'>
& {answersAll: Answer[]};

export const calcAnswersPossibilityAndSortByIt = async ({
    answersAll,
    ...rest
}: CalcAnswersPossibilityAndSortByItArgs) => {
    const answers = [...answersAll];
    const newAnswersPromises = answers.map(async (answer) => {
        return {
            ...answer,
            possibility: await calcCurrAnswerPossibility({...rest, answer, answersAll: answers})
        };
    })

    const newAnswers = await Promise.all(newAnswersPromises);

    return newAnswers.sort((a, b) => (a.possibility - b.possibility));
}

type CalcQuestionIsNextPossibilityArgs = {
    answersAll: Answer[];
    questionsNotAsked: Question[];
};

export const calcQuestionIsNextPossibility = async ({
    answersAll = [],
    questionsNotAsked = [],
}: CalcQuestionIsNextPossibilityArgs) => {
    if (questionsNotAsked.length == 0 || answersAll.length === 0) {
        return;
    }

    let answersWithMaxPoss = answersAll[0];

    const questionPromises = questionsNotAsked.map(async (question) => {
        // let maxChangeOfPossibility = 0;
        const diffPosForReactionsPromises: Promise<number>[] = [];

        Object.values(ReactionEnt).forEach(async (reaction_id) => {
            var tmp = exactReactionOnQuestionRelativelyAnswerPossibility({
                reaction_id,
                question,
                answersWithMaxPoss
            });

            // console.log({tmp});

            diffPosForReactionsPromises.push(tmp);
        });

        const diffPosForReactions = await Promise.all(diffPosForReactionsPromises);
        // console.log({diffPosForReactions, f: fuzz.Or(diffPosForReactions)});
        // question.possibility_of_this_is_next = fuzz.Or(diffPosForReactions);
        return {
            ...question,
            possibility_of_this_is_next: fuzz.Or(diffPosForReactions),
        }
    });

    const Q = await Promise.all(questionPromises);

    return Q.sort((a, b ) => a.possibility_of_this_is_next - b.possibility_of_this_is_next);
}

type CalcCurrAnswerPossibilityArgs = CalcApriorAnswerPossibilityArgs & {
    questionsAll: Question[];
    answer: Answer;
    questionAndReactionHistory: GameHistory;
}

export const calcCurrAnswerPossibility = async ({
    questionsAll,
    questionAndReactionHistory,
    answer,
    ...calcApriorAnswerPossibilityArgs
}: CalcCurrAnswerPossibilityArgs) => {
    if (Object.keys(questionAndReactionHistory).length == 0) {
        return calcApriorAnswerPossibility({...calcApriorAnswerPossibilityArgs, answer});
    }

    const Bj: number[] = [];

    for(let pair in questionAndReactionHistory) {
        var react = questionAndReactionHistory[pair];
        var question = questionsAll.find((q) => q.id === Number(pair));

        if (question) {
            const rezPossibil
                = await exactReactionOnQuestionRelativelyAnswerPossibility({
                    reaction_id: react as unknown as number,
                    question,
                    answersWithMaxPoss: answer,
                });
            Bj.push(rezPossibil);
        }

        // console.log({pair, react, question});

    }

    var rez = fuzz.Or(Bj);

    // console.log({rez, Bj});

    return rez;
}


export const exactReactionOnQuestionRelativelyAnswerPossibility = async ({
    answersWithMaxPoss,
    question,
    reaction_id,
}: {
    reaction_id: number;
    question: Question;
    answersWithMaxPoss: Answer;
}) => {
    let pBjAi;

    const {data: {
        count: countOfExactReactionForThisQWhenThinkAboutAnswer
    }} = await axios.post('/api/game-details', {
        algorithm: Algorithm.ReactionCountWhenThinkAboutAnswer,
        answer_id: answersWithMaxPoss.id,
        question_id: question.id,
        reaction_id,
    });

    const {data: {
        count: countOfQuestionAskedWhenThinkAboutAnswer
    }} = await axios.post('/api/game-details', {
        algorithm: Algorithm.TimesAskedWhenThinkAbout,
        answer_id: answersWithMaxPoss.id,
        question_id: question.id,
    });

    // console.log({countOfExactReactionForThisQWhenThinkAboutAnswer, countOfQuestionAskedWhenThinkAboutAnswer});
    if (Number(countOfExactReactionForThisQWhenThinkAboutAnswer) === 0) {
        const reactionQuantity = Object.values(ReactionEnt).length;

        pBjAi = helper.Bayes(1, 1, reactionQuantity);
        // console.log({x: 1, pBjAi, countOfExactReactionForThisQWhenThinkAboutAnswer, reactionQuantity});
    } else {
        
        pBjAi = helper.Bayes(1, Number(countOfExactReactionForThisQWhenThinkAboutAnswer), Number(countOfQuestionAskedWhenThinkAboutAnswer));
        // console.log({x: 2, pBjAi, countOfExactReactionForThisQWhenThinkAboutAnswer, countOfQuestionAskedWhenThinkAboutAnswer});
    }

    return pBjAi;
}

type CalcApriorAnswerPossibilityArgs = {
    answer: Answer;
    answersAll: Answer[];
    apriorAnswerPossibilityType: ApriorAnswerPossibilityType;
    gamesCount: number;
};

export const calcApriorAnswerPossibility = async ({
    answer,
    answersAll,
    apriorAnswerPossibilityType,
    gamesCount,
}: CalcApriorAnswerPossibilityArgs) =>{
    if (apriorAnswerPossibilityType == ApriorAnswerPossibilityType.Standard) {
        return 1.0 / answersAll.length;
    } else if (apriorAnswerPossibilityType == ApriorAnswerPossibilityType.Intelligent) {
        if (gamesCount === 0)
            return 1;

        return answer.countOfGamesWhenWasAsTarget / gamesCount;
    }

    return 0;
}