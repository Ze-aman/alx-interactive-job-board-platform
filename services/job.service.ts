import { db } from '@/lib/database';

export const getFilteredJobs = async ({
  category, // mapping this to department
  location,
  search,
  experience,
  page = 1,
  limit = 10,
}: {
  category?: string | string[];
  location?: string;
  search?: string;
  experience?: string | string[];
  page?: number;
  limit?: number;
}) => {
  const where: string[] = [];
  const values: string[] = [];

  if (category) {
    if (Array.isArray(category)) {
      const cats = category.filter((c) => String(c).trim());
      if (cats.length) {
        const placeholders = cats.map(() => '?').join(',');
        where.push(`j.department IN (${placeholders})`);
        values.push(...cats);
      }
    } else {
      where.push('j.department = ?');
      values.push(category);
    }
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
    const toPatterns = (exp: string) => {
      if (exp === 'entry') return ['%Entry%', '%Junior%', '%Intern%', '%Associate%'];
      if (exp === 'mid') return ['%Mid%', '%Intermediate%', '%II%', '%Experienced%'];
      if (exp === 'senior') return ['%Senior%', '%Lead%', '%Principal%', '%Staff%'];
      return [];
    };

    if (Array.isArray(experience)) {
      const exps = experience.filter((e) => ['entry','mid','senior'].includes(String(e)));
      if (exps.length) {
        const groupSQLs: string[] = [];
        const groupValues: string[] = [];
        exps.forEach((e) => {
          const pats = toPatterns(String(e));
          if (pats.length) {
            groupSQLs.push('(j.title LIKE ? OR j.title LIKE ? OR j.title LIKE ? OR j.title LIKE ?)');
            groupValues.push(...pats);
          }
        });
        if (groupSQLs.length) {
          where.push(`(${groupSQLs.join(' OR ')})`);
          values.push(...groupValues);
        }
      }
    } else {
      const pats = toPatterns(String(experience));
      if (pats.length) {
        where.push('(j.title LIKE ? OR j.title LIKE ? OR j.title LIKE ? OR j.title LIKE ?)');
        values.push(...pats);
      }
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