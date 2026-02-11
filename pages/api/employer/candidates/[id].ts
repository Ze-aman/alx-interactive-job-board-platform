import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/auth';
import { db } from '@/lib/database';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = (req as unknown as { user: { role: string } }).user;
  if (auth.role !== 'employer') return res.status(403).json({ message: 'Forbidden' });
  const { id } = req.query as { id?: string };
  if (!id) return res.status(400).json({ message: 'Invalid id' });

  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const [rows]: unknown[] = await db.query(
    `SELECT cp.full_name, cp.title, cp.location, cp.bio, cp.phone, u.email
     FROM candidate_profiles cp
     JOIN users u ON cp.user_id = u.id
     WHERE cp.user_id = ?`,
    [id]
  );
  if ((rows as unknown[]).length === 0) return res.status(404).json({ message: 'Profile not found' });

  const [experiences]: unknown[] = await db.query(
    `SELECT title, company, start_date, end_date, description
     FROM candidate_experiences
     WHERE user_id = ?
     ORDER BY start_date DESC`,
    [id]
  );

  let profile_picture_url: string | undefined;
  try {
    const [urows]: unknown[] = await db.query(
      'SELECT profile_picture_url FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    const first = (urows as Array<{ profile_picture_url?: string }>)[0];
    profile_picture_url = first?.profile_picture_url || undefined;
  } catch {}
  if (!profile_picture_url) {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public', 'uploads', `user-${id}.png`);
      if (fs.existsSync(filePath)) profile_picture_url = `/uploads/user-${id}.png`;
    } catch {}
  }

  const profileRow = (rows as Array<Record<string, unknown>>)[0];
  return res.status(200).json({ ...profileRow, experiences, profile_picture_url });
}

export default withAuth(handler, ['employer']);