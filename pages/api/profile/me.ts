import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/auth';
import { db } from '@/lib/database';
import { getIronSession } from 'iron-session';
import { sessionOptions, IronSessionData } from '@/lib/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = (req as any).user;
  const session = await getIronSession<IronSessionData>(req, res, sessionOptions);

  if (auth.role === 'candidate') {
    const [rows]: any = await db.query(
      `SELECT cp.full_name, cp.title, cp.location, cp.bio, cp.phone, u.email
       FROM candidate_profiles cp
       JOIN users u ON cp.user_id = u.id
       WHERE cp.user_id = ?`,
      [auth.userId]
    );
    if (!rows.length) return res.status(404).json({ message: 'Profile not found' });

    const [experiences]: any = await db.query(
      `SELECT id, title, company, start_date, end_date, description
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

    return res.status(200).json({
      role: 'candidate',
      profile: { ...rows[0], experiences, profile_picture_url },
    });
  }

  if (auth.role === 'employer') {
    let companyId = session.user?.companyId;
    if (!companyId) {
      const [cu]: any = await db.query(
        'SELECT company_id FROM company_users WHERE user_id = ? LIMIT 1',
        [auth.userId]
      );
      if (!cu.length) return res.status(404).json({ message: 'Company not found' });
      companyId = cu[0].company_id?.toString();
    }

    const [company]: any = await db.query(
      'SELECT id AS company_id, name, industry, location, verified FROM companies WHERE id = ?',
      [companyId]
    );
    if (!company.length) return res.status(404).json({ message: 'Company not found' });

    let logo_url: string | undefined;
    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public', 'uploads', `company-${companyId}.png`);
      if (fs.existsSync(filePath)) {
        logo_url = `/uploads/company-${companyId}.png`;
      }
    } catch {}

    let user_profile_picture_url: string | undefined;
    try {
      const [[u]]: any = await db.query(
        'SELECT profile_picture_url FROM users WHERE id = ? LIMIT 1',
        [auth.userId]
      );
      user_profile_picture_url = u?.profile_picture_url || undefined;
    } catch {}

    return res.status(200).json({
      role: 'employer',
      profile: { ...company[0], logo_url, user_profile_picture_url },
    });
  }

  return res.status(400).json({ message: 'Unsupported role' });
}

export default withAuth(handler);