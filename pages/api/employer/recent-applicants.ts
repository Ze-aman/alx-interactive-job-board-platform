import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/auth';
import { db } from '@/lib/database';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = (req as any).user;
  if (auth.role !== 'employer') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const limit = Math.max(1, Math.min(10, Number((req.query as any).limit) || 5));
    const [rows]: any = await db.query(
      `SELECT ja.id, ja.candidate_id, ja.applied_at, j.title AS role, cp.full_name AS candidate_name
       FROM job_applications ja
       JOIN jobs j ON ja.job_id = j.id
       LEFT JOIN candidate_profiles cp ON cp.user_id = ja.candidate_id
       WHERE j.company_id = ?
       ORDER BY ja.applied_at DESC
       LIMIT ?`,
      [auth.companyId, limit]
    );

    const data = (rows || []).map((r: any) => ({
      id: r.id,
      name: r.candidate_name || 'Candidate',
      role: r.role,
      applied_at: r.applied_at,
      img: String(r.candidate_id || '1'),
    }));

    return res.status(200).json({ data });
  } catch (error) {
    console.error('Error fetching recent applicants:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default withAuth(handler);