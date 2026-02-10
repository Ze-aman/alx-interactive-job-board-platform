import type { NextApiRequest, NextApiResponse } from 'next';
import { registerUser } from '@/services/auth.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, role, name, industry } = req.body;

  try {
    const result = await registerUser({ email, password, role, name, industry });
    return res.status(201).json({ message: 'User registered successfully', user: { id: result.userId } });
  } catch (error: any) {
    if (error?.message === 'Email already registered') {
      return res.status(400).json({ message: 'User already exists' });
    }
    if (error?.message === 'Invalid role specified') {
      return res.status(400).json({ message: 'Invalid role specified' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}