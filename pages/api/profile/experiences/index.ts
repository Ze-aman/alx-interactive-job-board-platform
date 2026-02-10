import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/auth';
import { db } from '@/lib/database';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = (req as any).user;
  if (auth.role !== 'candidate') return res.status(403).json({ message: 'Forbidden' });

  if (req.method === 'GET') {
    const [rows]: any = await db.query(
      `SELECT id, title, company, start_date, end_date, description
       FROM candidate_experiences WHERE user_id = ? ORDER BY start_date DESC`,
      [auth.userId]
    );
    return res.status(200).json({ data: rows });
  }

  if (req.method === 'POST') {
    const { title, company, start_date, end_date, description } = req.body || {};
    if (!title || !company) return res.status(400).json({ message: 'title and company are required' });

    const [result]: any = await db.query(
      `INSERT INTO candidate_experiences (user_id, title, company, start_date, end_date, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [auth.userId, title, company, start_date || null, end_date || null, description || null]
    );
    return res.status(201).json({ id: result.insertId });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

export default withAuth(handler);