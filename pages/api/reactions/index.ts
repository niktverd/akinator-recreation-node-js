import type { NextApiRequest, NextApiResponse } from 'next';

import * as reactionApi from '../../../src/api/reactions';


async function get(_req: NextApiRequest, res: NextApiResponse) {
    try {
        const reactions = await reactionApi.getList();

        return res.status(201).json(reactions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ошибка при создании пользователя' });
    }
}

async function post(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {slug} = req.body;
        await reactionApi.add({
            slug,
        });

        return await get(req, res);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ошибка при создании пользователя' });
    }
}

async function patch(req: NextApiRequest, res: NextApiResponse) {
    try {
        const id = Number(req.query.id)
        const {slug} = req.body;
        await reactionApi.update({
            id, 
            slug,
        });

        return await get(req, res);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ошибка при создании пользователя' });
    }
}

async function del(req: NextApiRequest, res: NextApiResponse) {
    try {
        const id = Number(req.query.id)
        await reactionApi.remove(id);

        return await get(req, res);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ошибка при создании пользователя' });
    }
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
