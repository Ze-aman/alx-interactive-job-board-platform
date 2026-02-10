import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const [[countRow]]: any = await db.query(
      `SELECT COUNT(*) as cnt FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = 'admin'`
    );
    if (Number(countRow?.cnt) > 0) {
      return res.status(200).json({ message: 'Admin already exists' });
    }

    const passwordHash = await bcrypt.hash('Admin@123', 10);
    const [[roleRow]]: any = await db.query(`SELECT id FROM roles WHERE name = 'admin' LIMIT 1`);
    const roleId = roleRow?.id;
    if (!roleId) return res.status(500).json({ message: 'Admin role missing' });

    const [ins]: any = await db.query(
      `INSERT INTO users (email, password_hash, role_id) VALUES (?, ?, ?)`,
      ['admin@jobboard.local', passwordHash, roleId]
    );

    return res.status(201).json({ message: 'Admin created', email: 'admin@jobboard.local', password: 'Admin@123', id: ins.insertId });
  } catch (e) {
    console.error('Seed admin failed:', e);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}