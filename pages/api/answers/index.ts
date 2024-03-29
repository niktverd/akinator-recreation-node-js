import Answer from '@/db/Answer';
import type { NextApiRequest, NextApiResponse } from 'next';


async function get(_req: NextApiRequest, res: NextApiResponse) {
    try {
        const answers = await Answer.query().select();

        return res.status(201).json(answers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ошибка при создании пользователя' });
    }
}

async function post(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {text} = req.body;
        await Answer.query().insert({
            text,
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
        const {text} = req.body;
        await Answer.query().updateAndFetchById(id, {
            text,
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
        await Answer.query().deleteById(id);

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
