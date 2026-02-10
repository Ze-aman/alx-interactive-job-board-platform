import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ message: 'Invalid id' });

  try {
    const [[job]]: any = await db.query(
      `SELECT j.*, c.name AS company_name
       FROM jobs j
       JOIN companies c ON j.company_id = c.id
       WHERE j.id = ?
       LIMIT 1`,
      [id]
    );

    if (!job) return res.status(404).json({ message: 'Job not found' });

    const [[desc]]: any = await db.query(
      `SELECT description_html FROM job_descriptions WHERE job_id = ? LIMIT 1`,
      [id]
    );

    const [reqs]: any = await db.query(
      `SELECT requirement_text FROM job_requirements WHERE job_id = ? ORDER BY id ASC`,
      [id]
    );

    const requirements = (reqs || []).map((r: any) => r.requirement_text);
    const description_html = desc?.description_html || null;
    let benefits: string[] = [];
    try {
      const [bens]: any = await db.query(
        `SELECT benefit_text FROM job_benefits WHERE job_id = ? ORDER BY id ASC`,
        [id]
      );
      benefits = (bens || []).map((b: any) => b.benefit_text);
    } catch (e) {
      benefits = [];
    }

    return res.status(200).json({ ...job, description_html, requirements, benefits });
  } catch (err) {
    console.error('Job detail error:', err);
    return res.status(500).json({ message: 'Failed to fetch job detail' });
  }
}
