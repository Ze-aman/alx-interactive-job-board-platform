import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/auth';
import { db } from '@/lib/database';

function mapStatusToStage(status: string) {
  if (status === 'shortlisted') return 'Interview';
  if (status === 'hired') return 'Offer';
  return 'Screening';
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = (req as any).user;
  if (auth.role !== 'employer') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { q, stage, job_id, page = '1', limit = '20' } = req.query as any;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(100, Number(limit)));
    const offset = (pageNum - 1) * limitNum;

    const filters: any[] = [auth.companyId];
    let where = 'j.company_id = ?';

    if (q && typeof q === 'string') {
      where += ' AND (cp.full_name LIKE ? OR u.email LIKE ? OR j.title LIKE ?)';
      filters.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    if (job_id) {
      where += ' AND ja.job_id = ?';
      filters.push(Number(job_id));
    }
    if (stage && typeof stage === 'string') {
      let statusFilter: string | undefined;
      if (stage === 'Screening') statusFilter = 'applied';
      if (stage === 'Interview' || stage === 'Technical Test') statusFilter = 'shortlisted';
      if (stage === 'Offer') statusFilter = 'hired';
      if (statusFilter) {
        where += ' AND ja.status = ?';
        filters.push(statusFilter);
      }
    }

    const [rows]: any = await db.query(
      `SELECT ja.id, ja.applied_at, ja.status, ja.job_id,
              j.title AS role,
              u.email,
              cp.full_name AS name
       FROM job_applications ja
       JOIN jobs j ON ja.job_id = j.id
       JOIN companies c ON j.company_id = c.id
       LEFT JOIN candidate_profiles cp ON cp.user_id = ja.candidate_id
       LEFT JOIN users u ON u.id = ja.candidate_id
       WHERE ${where}
       ORDER BY ja.applied_at DESC
       LIMIT ? OFFSET ?`,
      [...filters, limitNum, offset]
    );

    const data = (rows || []).map((r: any) => ({
      id: r.id,
      name: r.name || 'Candidate',
      role: r.role,
      stage: mapStatusToStage(r.status || 'applied'),
      status: r.status || 'applied',
      email: r.email || '—',
      applied_at: r.applied_at,
      img: String(r.job_id || '1'),
    }));

    return res.status(200).json({ data, pagination: { page: pageNum, limit: limitNum } });
  } catch (error) {
    console.error('Error fetching employer applicants:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default withAuth(handler);