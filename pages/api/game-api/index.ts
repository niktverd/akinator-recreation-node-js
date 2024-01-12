import Game from '@/db/Game';
import type { NextApiRequest, NextApiResponse } from 'next';
import { transaction } from 'objection';
import * as questionReactionApi from '../../../src/api/questions-reactions';
import * as questionApi from '../../../src/api/questions';
import * as answerApi from '../../../src/api/answers';
import * as gameHistoryApi from '../../../src/api/games-history';
import { calcPossibilities } from '@/logic/server';
import Question from '@/models/Question';
import Answer from '@/models/Answer';

async function get(_req: NextApiRequest, res: NextApiResponse) {
    return res.status(404).json({message: 'method get is empty'});
}

async function post(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {game_id, question_id, reaction_id, apriorAnswerPossibilityType, mostPossibleAnswerId} = req.body;
        
        const {question, threeTopAnswers, gameQuestionReactionHistoryLength} = await transaction(Game, async (trx) => {
            await questionReactionApi.add({
                game_id,
                question_id,
                reaction_id,
            });
            const gameQuestionReactionHistory = await questionReactionApi.getList(game_id);
            const questionAndReactionHistory = gameQuestionReactionHistory.reduce((acc, qrh) => {
                acc[qrh.question_id] = qrh.reaction_id;
                return acc;
            }, {} as Record<number, number>);
            const questionsAll = await questionApi.getList();
            const answersAll = await answerApi.getList();
            const questionsNotAsked = questionsAll.filter((question) => {
                return !(question.id in questionAndReactionHistory);
            });
            const gamesCountArray = await gameHistoryApi.getList().count();
            const gamesCount = gamesCountArray[0].count as number;

            const [questions, answers] = await calcPossibilities({
                answersAll,
                questionsNotAsked,
                apriorAnswerPossibilityType,
                gamesCount,
                questionsAll,
                questionAndReactionHistory,
                isServer: true,
                mostPossibleAnswerId,
            });

            const maxPossibilityOfThisIsNext = (questions as unknown as Question[] || []).reduce((acc, item) => {
                return Math.max(acc, item.possibility_of_this_is_next);
            }, 0) || 0;
            const mostPossibleQuestionsOnly = (questions as unknown as Question[] || []).filter((a) => a.possibility_of_this_is_next === maxPossibilityOfThisIsNext) || [];
            const randomIndex = Math.floor(Math.random() * mostPossibleQuestionsOnly.length);
            const mostPossibleQuestion = mostPossibleQuestionsOnly. length ? mostPossibleQuestionsOnly[randomIndex] : null;
            const mostPossibleAnswers = (answers as unknown as Answer[] || []).sort((a, b) => b.possibility - a.possibility);

            return {
                question: mostPossibleQuestion,
                // threeTopAnswers: mostPossibleAnswers?.slice(0,3) || []
                threeTopAnswers: mostPossibleAnswers || [],
                gameQuestionReactionHistoryLength: gameQuestionReactionHistory.length,
            };
        })

        return res.status(201).json({
            question,
            threeTopAnswers,
            gameQuestionReactionHistoryLength,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ошибка при создании игры' });
    }
}

async function patch(req: NextApiRequest, res: NextApiResponse) {
    return res.status(404).json({message: 'method patch is empty'});
}

async function del(_req: NextApiRequest, res: NextApiResponse) {
    return res.status(404).json({message: 'method delete is empty'});
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        return await get(req, res);
    } else if (req.method === 'POST') {
        return await post(req, res);
    } else if (req.method === 'PATCH') {
        return await patch(req, res);
    } else if (req.method === 'DELETE') {
      return await del(req, res);
  }
}
