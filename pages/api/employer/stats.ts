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
    const companyId = auth.companyId;

    const [[openRow]]: any = await db.query(
      `SELECT COUNT(*) AS cnt FROM jobs WHERE company_id = ? AND status = 'published'`,
      [companyId]
    );

    const [[newAppsRow]]: any = await db.query(
      `SELECT COUNT(*) AS cnt
       FROM job_applications ja
       JOIN jobs j ON ja.job_id = j.id
       WHERE j.company_id = ? AND ja.applied_at >= NOW() - INTERVAL 7 DAY`,
      [companyId]
    );

    const [[prevAppsRow]]: any = await db.query(
      `SELECT COUNT(*) AS cnt
       FROM job_applications ja
       JOIN jobs j ON ja.job_id = j.id
       WHERE j.company_id = ?
         AND ja.applied_at >= NOW() - INTERVAL 14 DAY
         AND ja.applied_at < NOW() - INTERVAL 7 DAY`,
      [companyId]
    );

    const [[interviewsRow]]: any = await db.query(
      `SELECT COUNT(*) AS cnt
       FROM job_applications ja
       JOIN jobs j ON ja.job_id = j.id
       WHERE j.company_id = ? AND ja.status = 'shortlisted'`,
      [companyId]
    );

    const [[prevInterviewsRow]]: any = await db.query(
      `SELECT COUNT(*) AS cnt
       FROM job_applications ja
       JOIN jobs j ON ja.job_id = j.id
       WHERE j.company_id = ? AND ja.status = 'shortlisted'
         AND ja.applied_at >= NOW() - INTERVAL 14 DAY
         AND ja.applied_at < NOW() - INTERVAL 7 DAY`,
      [companyId]
    );

    const openPositions = Number(openRow?.cnt) || 0;
    const newApps = Number(newAppsRow?.cnt) || 0;
    const prevApps = Number(prevAppsRow?.cnt) || 0;
    const interviews = Number(interviewsRow?.cnt) || 0;
    const prevInterviews = Number(prevInterviewsRow?.cnt) || 0;

    const appsTrendPct = prevApps ? Math.round(((newApps - prevApps) / prevApps) * 100) : null;
    const interviewsTrendPct = prevInterviews ? Math.round(((interviews - prevInterviews) / prevInterviews) * 100) : null;

    return res.status(200).json({
      openPositions,
      newApplications: { count: newApps, trendPct: appsTrendPct },
      interviewsScheduled: { count: interviews, trendPct: interviewsTrendPct },
    });
  } catch (error) {
    console.error('Error fetching employer stats:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default withAuth(handler);