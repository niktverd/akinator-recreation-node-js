import { Algorithm } from '@/logic/common';
import type { NextApiRequest, NextApiResponse } from 'next';

import * as gameDetailsApi from '../../../src/api/game-details';


async function get(_req: NextApiRequest, res: NextApiResponse) {
    try {
        const gameDetails = await gameDetailsApi.getList();

        return res.status(201).json(gameDetails);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ошибка при получении деталей игр' });
    }
}

async function post(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {algorithm} = req.body;

        if (algorithm === Algorithm.TimesAskedWhenThinkAbout) {
            const {answer_id, question_id} = req.body;

            const result = await gameDetailsApi.getAnswerQuestionPopularity({
                answer_id,
                question_id,
            });

            return res.status(201).json(result[0]);
        }

        if (algorithm === Algorithm.ReactionCountWhenThinkAboutAnswer) {
            const {answer_id, question_id, reaction_id} = req.body;

            const result = await gameDetailsApi.getAnswerQuestionReactionPopularity({
                answer_id,
                question_id,
                reaction_id,
            });

            return res.status(201).json(result[0]);
        }

        if (algorithm === Algorithm.SaveGameDetails) {
            const {game_id, question_id, reaction_id} = req.body;
            const gameDetail = await gameDetailsApi.add({
                game_id,
                question_id,
                reaction_id,
            });

            return res.status(201).json(gameDetail);

        }

        return res.status(404).json({message: 'algorithm not found'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ошибка при работе с деталями игры' });
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        return await get(req, res);
    } else if (req.method === 'POST') {
        return await post(req, res);
    }
}
