import Game from '@/db/Game';
import type { NextApiRequest, NextApiResponse } from 'next';
import { transaction } from 'objection';
import * as questionReactionApi from '../../../src/api/questions-reactions';
import * as questionApi from '../../../src/api/questions';
import * as answerApi from '../../../src/api/answers';
import * as gameHistoryApi from '../../../src/api/games-history';
import { calcPossibilities } from '@/logic/common';

async function get(_req: NextApiRequest, res: NextApiResponse) {
    return res.status(404).json({message: 'method get is empty'});
}

async function post(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {game_id, question_id, reaction_id, apriorAnswerPossibilityType} = req.body;
        
        const {question, threeTopAnswers} = await transaction(Game, async (trx) => {
            // save question - reaction
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
            });

            const maxPossibilityOfThisIsNext = questions?.reduce((acc, item) => {
                return Math.max(acc, item.possibility_of_this_is_next);
            }, 0) || 0;
            const mostPossibleQuestionsOnly = questions?.filter((a) => a.possibility_of_this_is_next === maxPossibilityOfThisIsNext) || [];
            const randomIndex = Math.floor(Math.random() * mostPossibleQuestionsOnly.length);
            const mostPossibleQuestion = mostPossibleQuestionsOnly. length ? mostPossibleQuestionsOnly[randomIndex] : null;
            const mostPossibleAnswers = answers?.sort((a, b) => b.possibility - a.possibility);
            console.log({qLength: questions?.length, maxPossibilityOfThisIsNext, mostPossibleQuestionsOnlyLength: mostPossibleQuestionsOnly.length, mostPossibleQuestion, randomIndex});
            // console.log('questions', questions);
            // console.log('answers', answers);

            return {
                question: mostPossibleQuestion,
                // threeTopAnswers: mostPossibleAnswers?.slice(0,3) || []
                threeTopAnswers: mostPossibleAnswers || []
            };
        })

        return res.status(201).json({
            question,
            threeTopAnswers,
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
