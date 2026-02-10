import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/auth';
import { db } from '@/lib/database';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, industry, location } = req.body;
    const auth = (req as any).user;

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [companyResult]: any = await conn.query(
        'INSERT INTO companies (name, industry, location, verified) VALUES (?, ?, ?, false)',
        [name, industry, location || null]
      );
      const companyId = companyResult.insertId;

      await conn.query(
        'INSERT INTO company_users (user_id, company_id, role) VALUES (?, ?, ?)',
        [auth.userId, companyId, 'owner']
      );

      await conn.commit();
      return res.status(201).json({ message: 'Company created', companyId });
    } catch (e) {
      await conn.rollback();
      return res.status(500).json({ message: 'Failed to create company' });
    } finally {
      conn.release();
    }
  }

  const [companies]: any = await db.query(
    `SELECT c.id, c.name, c.industry, c.location, c.verified,
            COALESCE(SUM(j.status = 'published'), 0) AS active_jobs
     FROM companies c
     LEFT JOIN jobs j ON j.company_id = c.id AND j.status = 'published'
     GROUP BY c.id
     ORDER BY c.created_at DESC`
  );
  res.status(200).json(companies);
}

export default withAuth(handler, ['admin', 'employer']); // Admin, Employer
