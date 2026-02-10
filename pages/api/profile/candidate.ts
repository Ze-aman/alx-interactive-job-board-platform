import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/auth';
import { db } from '@/lib/database';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = (req as any).user;

  const [rows]: any = await db.query(
    `SELECT cp.full_name, cp.title, cp.location, cp.bio, cp.phone, u.email 
     FROM candidate_profiles cp 
     JOIN users u ON cp.user_id = u.id 
     WHERE cp.user_id = ?`,
    [auth.userId]
  );

  if (!rows.length) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  const [experiences]: any = await db.query(
    `SELECT title, company, start_date, end_date, description
     FROM candidate_experiences
     WHERE user_id = ?
     ORDER BY start_date DESC`,
    [auth.userId]
  );

  let profile_picture_url: string | undefined;
  try {
    const [[u]]: any = await db.query(
      'SELECT profile_picture_url FROM users WHERE id = ? LIMIT 1',
      [auth.userId]
    );
    profile_picture_url = u?.profile_picture_url || undefined;
  } catch {}
  if (!profile_picture_url) {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public', 'uploads', `user-${auth.userId}.png`);
      if (fs.existsSync(filePath)) profile_picture_url = `/uploads/user-${auth.userId}.png`;
    } catch {}
  }

  res.status(200).json({ ...rows[0], experiences, profile_picture_url });
}

export default withAuth(handler, ['candidate']);