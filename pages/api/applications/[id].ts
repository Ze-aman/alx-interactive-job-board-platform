import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/auth';
import { db } from '@/lib/database';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id?: string };
  if (!id) return res.status(400).json({ message: 'Invalid id' });

  if (req.method === 'GET') {
    const [rows]: unknown[] = await db.query(
      'SELECT * FROM job_applications WHERE id = ?',
      [id]
    );
    const rowsArr = rows as Array<Record<string, unknown>>;
    if (rowsArr.length === 0) return res.status(404).json({ message: 'Application not found' });
    return res.status(200).json(rowsArr[0]);
  }

  if (req.method === 'PATCH') {
    const auth = (req as unknown as { user: { role: string; companyId: number } }).user;
    if (auth.role !== 'employer') return res.status(403).json({ message: 'Forbidden' });
    const { status } = req.body || {};
    const allowed = ['applied','screening','shortlisted','interview','offer','hired','rejected'];
    if (!status || !allowed.includes(String(status))) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Normalize to supported DB statuses
    const normalized = (status === 'screening') ? 'applied'
                      : (status === 'interview') ? 'shortlisted'
                      : String(status);

    // Ensure this employer owns the job
    const [result]: unknown[] = await db.query(
      `UPDATE job_applications ja
       JOIN jobs j ON ja.job_id = j.id
       SET ja.status = ?
       WHERE ja.id = ? AND j.company_id = ?`,
      [normalized, id, auth.companyId]
    );
    const affected = (result as Array<{ affectedRows?: number }>)[0]?.affectedRows || 0;
    if (affected === 0) {
      return res.status(404).json({ message: 'Application not found or not owned by company' });
    }
    return res.status(200).json({ message: 'Status updated' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

export default withAuth(handler);
