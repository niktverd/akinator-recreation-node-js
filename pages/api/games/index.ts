import type { NextApiRequest, NextApiResponse } from 'next';

import * as gamesApi from '../../../src/api/games';


async function get(_req: NextApiRequest, res: NextApiResponse) {
    try {
        const games = await gamesApi.getList();

        return res.status(201).json(games);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ошибка при получении игр' });
    }
}

async function post(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {user_id, is_finished, is_succeed} = req.body;
        const newGame = await gamesApi.add({
            user_id,
            is_finished,
            is_succeed
        });

        return res.status(201).json(newGame);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ошибка при создании игры' });
    }
}

async function patch(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {id, user_id, is_finished, is_succeed} = req.body;
        const newGame = await gamesApi.update({
            id,
            user_id,
            is_finished,
            is_succeed
        });

        return res.status(201).json(newGame);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ошибка при обновлении игры' });
    }
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
