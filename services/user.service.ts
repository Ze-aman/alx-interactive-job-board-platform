import { db } from '@/lib/database';

interface CreateUserInput {
  email: string;
  passwordHash: string;
  role: 'candidate' | 'employer';
  roleId: number;
  name: string;
  industry?: string;
}

export const createUserWithRelations = async ({
  email,
  passwordHash,
  role,
  roleId,
  name,
  industry,
}: CreateUserInput) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [userResult]: any = await connection.query(
      `INSERT INTO users (email, password_hash, role_id)
       VALUES (?, ?, ?)`,
      [email, passwordHash, roleId]
    );

    const userId = userResult.insertId;

    if (role === 'candidate') {
      await connection.query(
        `INSERT INTO candidate_profiles (user_id, full_name)
         VALUES (?, ?)`,
        [userId, name]
      );
    } else if (role === 'employer') {
      const [companyResult]: any = await connection.query(
        `INSERT INTO companies (name, industry, verified) VALUES (?, ?, false)`,
        [name, industry || null]
      );
      const companyId = companyResult.insertId;
      await connection.query(
        `INSERT INTO company_users (user_id, company_id, role) VALUES (?, ?, 'owner')`,
        [userId, companyId]
      );
    }

    await connection.commit();

    return { userId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
