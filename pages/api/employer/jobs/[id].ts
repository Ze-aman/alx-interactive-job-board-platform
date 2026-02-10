import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id?: string };

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: 'Invalid job ID' });
  }

  if (req.method === 'DELETE') {
    try {
      await db.query('DELETE FROM jobs WHERE id = ?', [id]);
      res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
      console.error('Failed to delete job:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { title, department, location, employment_type, status, description_html, requirements, benefits } = req.body;
      
      if (!title || !department || !employment_type) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Update the main job record
      await db.query(
        'UPDATE jobs SET title = ?, department = ?, location = ?, employment_type = ?, status = ? WHERE id = ?',
        [title, department, location, employment_type, status, id]
      );

      // Update the job description
      if (description_html) {
        await db.query(
          'INSERT INTO job_descriptions (job_id, description_html) VALUES (?, ?) ON DUPLICATE KEY UPDATE description_html = ?',
          [id, description_html, description_html]
        );
      }

      // Update requirements (delete existing and insert new ones)
      if (Array.isArray(requirements)) {
        await db.query('DELETE FROM job_requirements WHERE job_id = ?', [id]);
        for (const reqText of requirements) {
          if (reqText && typeof reqText === 'string') {
            try {
              await db.query(
                'INSERT INTO job_requirements (job_id, requirement_text) VALUES (?, ?)',
                [id, reqText]
              );
            } catch (e) {
              // Silently ignore if table doesn't exist
            }
          }
        }
      }

      // Update benefits (delete existing and insert new ones)
      if (Array.isArray(benefits)) {
        await db.query('DELETE FROM job_benefits WHERE job_id = ?', [id]);
        for (const benText of benefits) {
          if (benText && typeof benText === 'string') {
            try {
              await db.query(
                'INSERT INTO job_benefits (job_id, benefit_text) VALUES (?, ?)',
                [id, benText]
              );
            } catch (e) {
              // Silently ignore if table doesn't exist
            }
          }
        }
      }

      res.status(200).json({ message: 'Job updated successfully' });
    } catch (error) {
      console.error('Failed to update job:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['DELETE', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}