import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/auth';
import { db } from '@/lib/database';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const [[usersRow]]: any = await db.query(`SELECT COUNT(*) AS cnt FROM users`);
    const [[jobsRow]]: any = await db.query(`SELECT COUNT(*) AS cnt FROM jobs WHERE status = 'published'`);
    const [[pendingCompaniesRow]]: any = await db.query(`SELECT COUNT(*) AS cnt FROM companies WHERE verified = 0`);

    const [apps]: any = await db.query(
      `SELECT ja.id, ja.status, ja.applied_at, j.title AS job_title, cp.full_name AS applicant_name
       FROM job_applications ja
       JOIN jobs j ON ja.job_id = j.id
       LEFT JOIN candidate_profiles cp ON cp.user_id = ja.candidate_id
       ORDER BY ja.applied_at DESC
       LIMIT 10`
    );

    return res.status(200).json({
      stats: {
        totalUsers: usersRow?.cnt || 0,
        activeJobs: jobsRow?.cnt || 0,
        pendingApprovals: pendingCompaniesRow?.cnt || 0,
      },
      recentApplications: apps.map((r: any) => ({
        id: r.id,
        applicant: r.applicant_name || 'Candidate',
        jobTitle: r.job_title,
        status: r.status || 'applied',
      })),
    });
  } catch (e) {
    console.error('Admin overview error:', e);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default withAuth(handler, ['admin']);