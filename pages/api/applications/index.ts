import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/auth';
import { db } from '@/lib/database';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = (req as unknown as { user: { userId: number } }).user;

  if (req.method === 'POST') {
    const { job_id } = req.body as { job_id?: number };

    const [jobsRows]: unknown[] = await db.query('SELECT id FROM jobs WHERE id = ?', [job_id]);
    if ((jobsRows as Array<Record<string, unknown>>).length === 0) {
      return res.status(400).json({ message: 'Invalid job_id' });
    }

    await db.query(
      'INSERT INTO job_applications (job_id, candidate_id, status) VALUES (?, ?, ?)',
      [job_id, user.userId, 'applied']
    );

    return res.status(201).json({ message: 'Application submitted' });
  }

  const { page = '1', limit = '10', from, to, status, sort, company, job_id } = req.query as Record<string, string>;
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Math.min(50, Number(limit)));
  const offset = (pageNum - 1) * limitNum;

  const filters: unknown[] = [user.userId];
  let where = 'ja.candidate_id = ?';
  if (from && to) {
    where += ' AND ja.applied_at BETWEEN ? AND ?';
    filters.push(from, to);
  }
  const allowedStatuses = ['applied','shortlisted','offer','hired','rejected'];
  if (status && allowedStatuses.includes(status)) {
    where += ' AND ja.status = ?';
    filters.push(status);
  }
  if (company) {
    where += ' AND c.name LIKE ?';
    filters.push(`%${company}%`);
  }
  if (job_id) {
    where += ' AND ja.job_id = ?';
    filters.push(Number(job_id));
  }
  let orderSQL = 'ORDER BY ja.applied_at DESC';
  if (sort === 'date_asc') orderSQL = 'ORDER BY ja.applied_at ASC';
  if (sort === 'company_asc') orderSQL = 'ORDER BY c.name ASC, ja.applied_at DESC';
  if (sort === 'company_desc') orderSQL = 'ORDER BY c.name DESC, ja.applied_at DESC';
  if (sort === 'role_asc') orderSQL = 'ORDER BY j.title ASC, ja.applied_at DESC';
  if (sort === 'role_desc') orderSQL = 'ORDER BY j.title DESC, ja.applied_at DESC';

  const [countRows]: unknown[] = await db.query(
    `SELECT COUNT(*) as total
     FROM job_applications ja
     JOIN jobs j ON ja.job_id = j.id
     JOIN companies c ON j.company_id = c.id
     WHERE ${where}`,
    filters
  );
  const total = (countRows as Array<{ total: number }>)[0]?.total || 0;

  const [apps]: unknown[] = await db.query(
    `SELECT ja.*, j.title, j.location, c.name AS company_name
     FROM job_applications ja
     JOIN jobs j ON ja.job_id = j.id
     JOIN companies c ON j.company_id = c.id
     WHERE ${where}
     ${orderSQL}
     LIMIT ? OFFSET ?`,
    [...filters, limitNum, offset]
  );

  const [last30]: unknown[] = await db.query(
    `SELECT status, COUNT(*) as cnt
     FROM job_applications
     WHERE candidate_id = ? AND applied_at >= NOW() - INTERVAL 30 DAY
     GROUP BY status`,
    [user.userId]
  );
  const [prev30]: unknown[] = await db.query(
    `SELECT COUNT(*) as cnt
     FROM job_applications
     WHERE candidate_id = ? AND applied_at >= NOW() - INTERVAL 60 DAY AND applied_at < NOW() - INTERVAL 30 DAY`,
    [user.userId]
  );
  const last30Total = (last30 as Array<{ cnt: number }>).reduce((a, r) => a + Number(r.cnt || 0), 0);
  const prev30Total = Number((prev30 as Array<{ cnt: number }>)[0]?.cnt || 0);
  const appliedCount = (apps as Array<{ status: string }>).filter(r => r.status === 'applied').length;

  const stats = {
    applied: appliedCount,
    shortlisted: (apps as Array<{ status: string }>).filter(r => r.status === 'shortlisted').length,
    hired: (apps as Array<{ status: string }>).filter(r => r.status === 'hired').length,
    rejected: (apps as Array<{ status: string }>).filter(r => r.status === 'rejected').length,
    last30: { total: last30Total },
    trend: { totalDeltaPct: prev30Total ? Math.round(((last30Total - prev30Total) / prev30Total) * 100) : null },
  };

  res.status(200).json({ data: apps, pagination: { total, page: pageNum, limit: limitNum }, stats });
}

export default withAuth(handler, ['candidate']); // Candidate
