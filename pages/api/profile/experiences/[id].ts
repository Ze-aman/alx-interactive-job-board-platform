import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/auth';
import { db } from '@/lib/database';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = (req as any).user;
  if (auth.role !== 'candidate') return res.status(403).json({ message: 'Forbidden' });

  const id = Number((req.query as any).id);
  if (!id) return res.status(400).json({ message: 'Invalid id' });

  if (req.method === 'PUT') {
    const { title, company, start_date, end_date, description } = req.body || {};
    if (!title || !company) return res.status(400).json({ message: 'title and company are required' });

    await db.query(
      `UPDATE candidate_experiences
       SET title = ?, company = ?, start_date = ?, end_date = ?, description = ?
       WHERE id = ? AND user_id = ?`,
      [title, company, start_date || null, end_date || null, description || null, id, auth.userId]
    );
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    await db.query(`DELETE FROM candidate_experiences WHERE id = ? AND user_id = ?`, [id, auth.userId]);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

export default withAuth(handler);
