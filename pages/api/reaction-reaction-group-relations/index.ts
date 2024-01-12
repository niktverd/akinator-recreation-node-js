import type { NextApiRequest, NextApiResponse } from 'next';

import * as reactionReactionGroupRelationApi from '../../../src/api/reaction-reaction-group-relations';


async function get(_req: NextApiRequest, res: NextApiResponse) {
    try {
        const reactionReactionGroup = await reactionReactionGroupRelationApi.getList();

        return res.status(201).json(reactionReactionGroup);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ошибка при создании пользователя' });
    }
}

async function post(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {id1, id2} = req.body;
        await reactionReactionGroupRelationApi.add({
            reaction_id: id1,
            reaction_group_id: id2,
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
        const {id1, id2} = req.body;
        await reactionReactionGroupRelationApi.update({
            id, 
            reaction_id: id1,
            reaction_group_id: id2,
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
        await reactionReactionGroupRelationApi.remove(id);

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
