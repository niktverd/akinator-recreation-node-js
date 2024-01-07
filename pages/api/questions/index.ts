import Question from '@/db/Question';
import type { NextApiRequest, NextApiResponse } from 'next';

import * as questionApi from '../../../src/api/questions';


async function get(req: NextApiRequest, res: NextApiResponse) {
    try {
        const questions = await questionApi.getList();

        return res.status(201).json(questions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ошибка при создании пользователя' });
    }
}

async function post(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {text, hidden_from_ui = false, shown_only_for_doctors = false, possibility_of_this_is_next = 0} = req.body;
        await questionApi.add({
            text,
            hidden_from_ui,
            shown_only_for_doctors,
            possibility_of_this_is_next,
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

        await questionApi.update({id, text});

        return await get(req, res);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ошибка при создании пользователя' });
    }
}

async function del(req: NextApiRequest, res: NextApiResponse) {
    try {
        const id = Number(req.query.id)
        await questionApi.remove(id);

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
