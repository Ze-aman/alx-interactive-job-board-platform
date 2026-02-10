import type { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';
import { sessionOptions, IronSessionData } from '@/lib/session';
import { db } from '@/lib/database';

interface AuthRequest extends NextApiRequest {
  user?: {
    userId: string;
    role: string;
    companyId?: string;
  };
}

export function withAuth(
  handler: (req: AuthRequest, res: NextApiResponse) => Promise<any>,
  roles: string[] = []
) {
  return async (req: AuthRequest, res: NextApiResponse) => {
    const session = await getIronSession<IronSessionData>(req, res, sessionOptions);
    const user = session.user;

    if (!user || !user.isLoggedIn) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    let companyId: string | undefined = user.companyId;
    if (user.role === 'employer' && !companyId) {
      try {
        const [rows]: any = await db.query(
          'SELECT company_id FROM company_users WHERE user_id = ? LIMIT 1',
          [user.id]
        );
        if (rows?.length) companyId = rows[0].company_id?.toString();
      } catch (e) {}
    }

    req.user = { userId: user.id, role: user.role, companyId };
    return handler(req, res);
  };
}
