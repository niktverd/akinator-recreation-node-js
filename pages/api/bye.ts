import User from '@/db/User';
import Answer from '@/db/Answer';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Метод не разрешен' });
    }
  
    try {
      console.log(User);
      const users = await Answer.query().select();
  
      return res.status(201).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Ошибка при создании пользователя' });
    }
  }