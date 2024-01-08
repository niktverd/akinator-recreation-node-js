import Fuzz from "@/fuzzy-logic/fuzz";
import Answer from "@/models/Answer";
import Question from "@/models/Question";
import { ReactionEnt } from "@/models/Reaction";
import { GameHistory } from "./db";
import { ApriorAnswerPossibilityType } from "@/common/types";
import Helper from "@/fuzzy-logic/Helper";
import axios from 'axios';
import * as gameDetailsApi from '../api/game-details';
import { Algorithm } from "@/common/constants";

const fuzz = new Fuzz();
const helper = new Helper();

const ___variants: Record<string, Question> = {};

type CalcPossibilitiesArgs = CalcQuestionIsNextPossibilityArgs
& CalcAnswersPossibilityAndSortByItArgs
& {
    answersAll: Answer[],
};

export const calcPossibilities = async ({
    answersAll,
    questionsNotAsked,
    isServer = false,
    mostPossibleAnswerId,
    ...rest
}: CalcPossibilitiesArgs) => {
    const sortedAnswersAll = await calcAnswersPossibilityAndSortByIt({...rest, answersAll, isServer});
    const nextQuestion = await calcQuestionIsNextPossibility({
        answersAll: sortedAnswersAll,
        questionsNotAsked,
        isServer,
        mostPossibleAnswerId,
    });

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
    isServer: boolean;
    mostPossibleAnswerId: number;
};

export const calcQuestionIsNextPossibility = async ({
    answersAll = [],
    questionsNotAsked = [],
    isServer,
    mostPossibleAnswerId = -1,
}: CalcQuestionIsNextPossibilityArgs) => {
    if (questionsNotAsked.length == 0 || answersAll.length === 0) {
        return;
    }

    let answersWithMaxPoss = answersAll.find((a) => a.id === mostPossibleAnswerId) || answersAll[0];

    const questionPromises = questionsNotAsked.map(async (question) => {
        // let maxChangeOfPossibility = 0;
        const diffPosForReactionsPromises: Promise<number>[] = [];

        Object.values(ReactionEnt).forEach(async (reaction_id) => {
            var tmp = exactReactionOnQuestionRelativelyAnswerPossibility({
                reaction_id,
                question,
                answersWithMaxPoss,
                isServer,
            });


            diffPosForReactionsPromises.push(tmp);

            const t = await tmp;
            if (isNaN(t)) {
            }
        });

        const diffPosForReactions = await Promise.all(diffPosForReactionsPromises);
        // question.possibility_of_this_is_next = fuzz.Or(diffPosForReactions);
        ___variants[fuzz.Or(diffPosForReactions).toFixed(5)] = question;
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
    isServer: boolean;
}

export const calcCurrAnswerPossibility = async ({
    questionsAll,
    questionAndReactionHistory,
    answer,
    isServer,
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
                    isServer,
                });
            Bj.push(rezPossibil);
        }


    }

    var rez = fuzz.Or(Bj);


    return rez;
}


export const exactReactionOnQuestionRelativelyAnswerPossibility = async ({
    answersWithMaxPoss,
    question,
    reaction_id,
    isServer,
}: {
    reaction_id: number;
    question: Question;
    answersWithMaxPoss: Answer;
    isServer: boolean;
}) => {
    let pBjAi, countOfExactReactionForThisQWhenThinkAboutAnswer, countOfQuestionAskedWhenThinkAboutAnswer;

    if (isServer) {
        const countOfExactReactionForThisQWhenThinkAboutAnswerServer = await gameDetailsApi.getAnswerQuestionReactionPopularity({
            answer_id: answersWithMaxPoss.id,
            question_id: question.id,
            reaction_id,
        });
        
        countOfExactReactionForThisQWhenThinkAboutAnswer = Number(countOfExactReactionForThisQWhenThinkAboutAnswerServer[0].count) || 0;

        const countOfQuestionAskedWhenThinkAboutAnswerServer = await gameDetailsApi.getAnswerQuestionPopularity({
            answer_id: answersWithMaxPoss.id,
            question_id: question.id,
        });
        
        countOfQuestionAskedWhenThinkAboutAnswer = Number(countOfQuestionAskedWhenThinkAboutAnswerServer[0].count) || 0;
        //     countOfQuestionAskedWhenThinkAboutAnswerServer,
        //     countOfExactReactionForThisQWhenThinkAboutAnswerServer
        // });
    } else {

        const {data: {
            count: countOfExactReactionForThisQWhenThinkAboutAnswerClient
        }} = await axios.post('/api/game-details', {
            algorithm: Algorithm.ReactionCountWhenThinkAboutAnswer,
            answer_id: answersWithMaxPoss.id,
            question_id: question.id,
            reaction_id,
        });
    
        const {data: {
            count: countOfQuestionAskedWhenThinkAboutAnswerClient
        }} = await axios.post('/api/game-details', {
            algorithm: Algorithm.TimesAskedWhenThinkAbout,
            answer_id: answersWithMaxPoss.id,
            question_id: question.id,
        });

        countOfExactReactionForThisQWhenThinkAboutAnswer = Number(countOfExactReactionForThisQWhenThinkAboutAnswerClient)
        countOfQuestionAskedWhenThinkAboutAnswer = Number(countOfQuestionAskedWhenThinkAboutAnswerClient)
    }

    if (countOfExactReactionForThisQWhenThinkAboutAnswer === 0) {
        const reactionQuantity = Object.values(ReactionEnt).length;

        pBjAi = helper.Bayes(1, 1, reactionQuantity);
    } else {
        
        pBjAi = helper.Bayes(1, countOfExactReactionForThisQWhenThinkAboutAnswer, countOfQuestionAskedWhenThinkAboutAnswer || 1);
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
