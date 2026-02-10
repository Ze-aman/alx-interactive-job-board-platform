import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/auth';
import { db } from '@/lib/database';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      const { logo_base64 } = req.body || {};
      if (!logo_base64 || typeof logo_base64 !== 'string') {
        return res.status(400).json({ message: 'logo_base64 required' });
      }
      const commaIdx = logo_base64.indexOf(',');
      const header = commaIdx >= 0 ? logo_base64.slice(0, commaIdx) : '';
      const data = commaIdx >= 0 ? logo_base64.slice(commaIdx + 1) : logo_base64;
      const mime = header.match(/data:(.*?);base64/)?.[1] || 'image/png';
      const ext = mime.includes('jpeg') ? 'jpg' : mime.split('/')[1] || 'png';
      const buffer = Buffer.from(data, 'base64');
      const path = await import('path');
      const fs = await import('fs');
      const dir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const filePath = path.join(dir, `company-${id}.png`); // normalize to png
      fs.writeFileSync(filePath, buffer);
      return res.status(200).json({ logo_url: `/uploads/company-${id}.png` });
    } catch (e) {
      console.error('Logo upload failed:', e);
      return res.status(500).json({ message: 'Failed to upload logo' });
    }
  }

  if (req.method === 'PATCH') {
    const { verified, name, industry, location } = req.body || {};
    const fields: string[] = [];
    const params: any[] = [];
    if (typeof verified === 'boolean') {
      fields.push('verified = ?');
      params.push(verified);
    }
    if (typeof name === 'string') {
      fields.push('name = ?');
      params.push(name);
    }
    if (typeof industry === 'string') {
      fields.push('industry = ?');
      params.push(industry);
    }
    if (typeof location === 'string') {
      fields.push('location = ?');
      params.push(location);
    }
    if (!fields.length) return res.status(400).json({ message: 'No fields to update' });
    params.push(id);
    await db.query(`UPDATE companies SET ${fields.join(', ')} WHERE id = ?`, params);
    const [[updated]]: any = await db.query('SELECT * FROM companies WHERE id = ? LIMIT 1', [id]);
    return res.status(200).json(updated);
  }

  const [rows]: any = await db.query(
    'SELECT * FROM companies WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: 'Company not found' });
  }

  res.status(200).json(rows[0]);
}

export default withAuth(handler);
