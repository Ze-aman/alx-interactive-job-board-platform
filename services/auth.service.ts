import bcrypt from 'bcryptjs';
import { createUserWithRelations } from './user.service';
import { db } from '@/lib/database';

export const registerUser = async (input: {
  email: string;
  password: string;
  role: 'candidate' | 'employer';
  name: string;
  industry?: string;
}) => {
  const [existing]: any = await db.query(`SELECT id FROM users WHERE email = ?`, [input.email]);
  if (existing.length > 0) throw new Error('Email already registered');

  const passwordHash = await bcrypt.hash(input.password, 10);

  const [roles]: any = await db.query(`SELECT id FROM roles WHERE name = ?`, [input.role]);
  if (!roles.length) throw new Error('Invalid role specified');
  const roleId = roles[0].id;

  return await createUserWithRelations({
    email: input.email,
    passwordHash,
    role: input.role,
    roleId,
    name: input.name,
    industry: input.industry,
  });
};

export const loginUser = async (email: string, password: string) => {
  const [rows]: any = await db.query(
    `SELECT u.id, u.password_hash, r.name AS role
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.email = ?`,
    [email]
  );

  if (!rows.length) throw new Error('Invalid credentials');

  const user = rows[0];
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) throw new Error('Invalid credentials');

  return { id: user.id, role: user.role };
};
