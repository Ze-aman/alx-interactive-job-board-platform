import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/auth';
import { db } from '@/lib/database';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { role, q } = req.query as any;
  const where: string[] = [];
  const params: any[] = [];
  if (role && typeof role === 'string') {
    where.push('r.name = ?');
    params.push(role);
  }
  if (q && typeof q === 'string') {
    where.push('u.email LIKE ?');
    params.push(`%${q}%`);
  }

  const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [users]: any = await db.query(
    `SELECT u.id, u.email, u.role_id, u.created_at, r.name AS role
     FROM users u
     LEFT JOIN roles r ON u.role_id = r.id
     ${whereSQL}
     ORDER BY u.created_at DESC`
  , params);
  res.status(200).json(users);
}

export default withAuth(handler, ['admin']); // Admin only
