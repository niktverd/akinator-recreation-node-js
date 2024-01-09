import type { NextApiRequest, NextApiResponse } from 'next';

import * as questionReleaseApi from '../../../src/api/question-release';


async function get(_req: NextApiRequest, res: NextApiResponse) {
    try {
        const questions = await questionReleaseApi.getList();

        return res.status(201).json(questions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ошибка при создании пользователя' });
    }
}

async function post(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {
            id1,
            id2,
        } = req.body;
        await questionReleaseApi.add({
            asked_question_id: id1,
            released_question_id: id2,
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
        const {
            id1,
            id2,
        } = req.body;

        await questionReleaseApi.update({id,  asked_question_id: id1, released_question_id: id2});

        return await get(req, res);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ошибка при создании пользователя' });
    }
}

async function del(req: NextApiRequest, res: NextApiResponse) {
    try {
        const id = Number(req.query.id)
        await questionReleaseApi.remove(id);

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
