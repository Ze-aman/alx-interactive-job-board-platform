import { db } from '@/lib/database';

export const getFilteredJobs = async ({
  category, // mapping this to department
  location,
  search,
  experience,
  page = 1,
  limit = 10,
}: any) => {
  const where: string[] = [];
  const values: any[] = [];

  if (category) {
    where.push('j.department = ?');
    values.push(category);
  }

  if (location) {
    where.push('j.location = ?');
    values.push(location);
  }

  if (search) {
    where.push('(j.title LIKE ? OR j.department LIKE ?)');
    values.push(`%${search}%`, `%${search}%`);
  }

  if (typeof experience !== 'undefined') {
    const exp = experience;

    if (exp === 'entry') {
      where.push('(j.title LIKE ? OR j.title LIKE ? OR j.title LIKE ? OR j.title LIKE ?)');
      values.push('%Entry%', '%Junior%', '%Intern%', '%Associate%');
    } else if (exp === 'mid') {
      where.push('(j.title LIKE ? OR j.title LIKE ? OR j.title LIKE ? OR j.title LIKE ?)');
      values.push('%Mid%', '%Intermediate%', '%II%', '%Experienced%');
    } else if (exp === 'senior') {
      where.push('(j.title LIKE ? OR j.title LIKE ? OR j.title LIKE ? OR j.title LIKE ?)');
      values.push('%Senior%', '%Lead%', '%Principal%', '%Staff%');
    }
  }

  const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  // We JOIN with companies to get the employer name
  const dataSQL = `
    SELECT j.*, c.name as company_name 
    FROM jobs j
    JOIN companies c ON j.company_id = c.id
    ${whereSQL}
    ORDER BY j.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const [rows] = await db.query(dataSQL, [...values, limit, offset]);
  // mysql2 returns rows as the first element of an array
  return { data: rows }; 
};