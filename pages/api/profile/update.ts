import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/auth';
import { db } from '@/lib/database';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const auth = (req as any).user;
  if (auth.role !== 'candidate') return res.status(403).json({ message: 'Forbidden' });

  const { full_name, title, location, phone, bio } = req.body || {};
  if (typeof full_name === 'undefined' || typeof title === 'undefined' || typeof location === 'undefined' || typeof phone === 'undefined' || typeof bio === 'undefined') {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  await db.query(
    `UPDATE candidate_profiles SET full_name = ?, title = ?, location = ?, phone = ?, bio = ? WHERE user_id = ?`,
    [full_name || null, title || null, location || null, phone || null, bio || null, auth.userId]
  );

  const [rows]: any = await db.query(
    `SELECT cp.full_name, cp.title, cp.location, cp.bio, cp.phone, u.email
     FROM candidate_profiles cp
     JOIN users u ON cp.user_id = u.id
     WHERE cp.user_id = ?`,
    [auth.userId]
  );

  return res.status(200).json({ profile: rows[0] });
}

export default withAuth(handler);