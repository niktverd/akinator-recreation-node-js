import GameHistory from '@/db/GameHistory';
import type { NextApiRequest, NextApiResponse } from 'next';


async function get(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {games_count} = req.query;
        if (games_count) {
            const gamesCount = await GameHistory.query().select().count();
    
            return res.status(201).json({gamesCount});
        }

        const gameHistory = await GameHistory.query().select();
    
            return res.status(201).json(gameHistory);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ошибка в получении количества игр' });
    }
}

async function post(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {answer_id, user_id, game_id} = req.body;

        const result = await GameHistory.query().insert({
            game_id,
            user_id,
            answer_id,
            approved_by_moderator: 1,
        });

        return res.status(201).json(result);
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
