import User from '@/db/User';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Метод не разрешен' });
    }
  
    try {
      console.log(User);
      const newUser = await User.query().insert({
        login: Math.random().toString(),
        is_doctor: false,
      });
  
      return res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Ошибка при создании пользователя' });
    }
  }