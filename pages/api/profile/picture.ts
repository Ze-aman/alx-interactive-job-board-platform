import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/auth';
import { db } from '@/lib/database';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const auth = (req as any).user;

  const { image_base64 } = req.body || {};
  if (!image_base64 || typeof image_base64 !== 'string') {
    return res.status(400).json({ message: 'image_base64 required' });
  }

  try {
    const commaIdx = image_base64.indexOf(',');
    const header = commaIdx >= 0 ? image_base64.slice(0, commaIdx) : '';
    const data = commaIdx >= 0 ? image_base64.slice(commaIdx + 1) : image_base64;
    const mime = header.match(/data:(.*?);base64/)?.[1] || 'image/png';
    const buffer = Buffer.from(data, 'base64');

    const path = await import('path');
    const fs = await import('fs');
    const dir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, `user-${auth.userId}.png`);
    fs.writeFileSync(filePath, buffer);

    const url = `/uploads/user-${auth.userId}.png`;

    const [[col]]: any = await db.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'profile_picture_url'`
    );
    if (!col?.cnt) {
      try {
        await db.query(
          `ALTER TABLE users ADD COLUMN profile_picture_url VARCHAR(255) DEFAULT NULL`
        );
      } catch {}
    }

    await db.query(`UPDATE users SET profile_picture_url = ? WHERE id = ?`, [url, auth.userId]);

    return res.status(200).json({ profile_picture_url: url });
  } catch (e) {
    console.error('Profile picture upload failed:', e);
    return res.status(500).json({ message: 'Failed to upload profile picture' });
  }
}

export default withAuth(handler);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};