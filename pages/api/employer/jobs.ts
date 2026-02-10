import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/auth';
import { db } from '@/lib/database';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = (req as any).user;
  if (auth.role !== 'employer') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method === 'POST') {
    try {
      const { title, department, location, employment_type, status, description_html, requirements, benefits } = req.body || {};
      if (!title || !department || !employment_type) {
        return res.status(400).json({ message: 'title, department, employment_type are required' });
      }
      const jobStatus = status === 'published' ? 'published' : 'draft';
      const publishedAt = jobStatus === 'published' ? new Date() : null;

      const [result]: any = await db.query(
        `INSERT INTO jobs (company_id, title, department, employment_type, location, status, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [auth.companyId, title, department, employment_type, location || null, jobStatus, publishedAt]
      );

      const jobId = result.insertId;
      if (description_html) {
        await db.query(
          `INSERT INTO job_descriptions (job_id, description_html) VALUES (?, ?)`,
          [jobId, description_html]
        );
      }

      if (Array.isArray(requirements) && requirements.length) {
        for (const reqText of requirements) {
          if (reqText && typeof reqText === 'string') {
            await db.query(
              `INSERT INTO job_requirements (job_id, requirement_text) VALUES (?, ?)`,
              [jobId, reqText]
            );
          }
        }
      }

      if (Array.isArray(benefits) && benefits.length) {
        for (const benText of benefits) {
          if (benText && typeof benText === 'string') {
            try {
              await db.query(
                `INSERT INTO job_benefits (job_id, benefit_text) VALUES (?, ?)`,
                [jobId, benText]
              );
            } catch (e) {
              // Silently ignore if job_benefits table doesn't exist yet
            }
          }
        }
      }

      return res.status(201).json({ id: jobId });
    } catch (error) {
      console.error('Error creating job:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'GET') {
    try {
      const [rows]: any = await db.query(
        `SELECT 
          j.id,
          j.title,
          j.department AS dept,
          j.employment_type AS type,
          j.created_at,
          j.status,
          COALESCE(COUNT(ja.id), 0) AS applicants,
          COALESCE(SUM(CASE WHEN ja.status = 'applied' THEN 1 ELSE 0 END), 0) AS applied_cnt,
          COALESCE(SUM(CASE WHEN ja.status = 'shortlisted' THEN 1 ELSE 0 END), 0) AS shortlisted_cnt,
          COALESCE(SUM(CASE WHEN ja.status = 'hired' THEN 1 ELSE 0 END), 0) AS hired_cnt,
          COALESCE(SUM(CASE WHEN ja.applied_at >= NOW() - INTERVAL 7 DAY THEN 1 ELSE 0 END), 0) AS news_cnt
        FROM jobs j
        LEFT JOIN job_applications ja ON ja.job_id = j.id
        WHERE j.company_id = ?
        GROUP BY j.id
        ORDER BY j.created_at DESC`,
        [auth.companyId]
      );

      const data = (rows || []).map((r: any) => {
        const total = Number(r.applicants) || 0;
        const applied = Number(r.applied_cnt) || 0;
        const shortlisted = Number(r.shortlisted_cnt) || 0;
        const hired = Number(r.hired_cnt) || 0;
        let stage = 'Screening';
        if (hired > 0) stage = 'Offer';
        else if (shortlisted > 0) stage = 'Interviewing';
        let progress = 0;
        if (total > 0) {
          const score = applied * 0.25 + shortlisted * 0.6 + hired * 1.0;
          progress = Math.max(0, Math.min(100, Math.round((score / total) * 100)));
        }
        let color = 'bg-[#137fec]';
        if (stage === 'Interviewing') color = 'bg-amber-500';
        if (stage === 'Offer') color = 'bg-emerald-500';
        return {
          id: r.id,
          title: r.title,
          dept: r.dept,
          type: r.type,
          created_at: r.created_at,
          status: r.status,
          stage,
          progress,
          applicants: total,
          news: Number(r.news_cnt) || 0,
          color,
        };
      });

      return res.status(200).json({ data });
    } catch (error) {
      console.error('Error fetching employer jobs:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

export default withAuth(handler);