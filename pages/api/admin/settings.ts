import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/auth';

let settings = {
  platformName: 'JobBoard Pro',
  supportEmail: 'support@jobboard.com',
  maintenanceMode: false,
  primaryColor: '#137FEC',
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json(settings);
  }
  if (req.method === 'POST') {
    const body = req.body || {};
    settings = {
      platformName: typeof body.platformName === 'string' ? body.platformName : settings.platformName,
      supportEmail: typeof body.supportEmail === 'string' ? body.supportEmail : settings.supportEmail,
      maintenanceMode: typeof body.maintenanceMode === 'boolean' ? body.maintenanceMode : settings.maintenanceMode,
      primaryColor: typeof body.primaryColor === 'string' ? body.primaryColor : settings.primaryColor,
    };
    return res.status(200).json(settings);
  }
  return res.status(405).json({ message: 'Method not allowed' });
}

export default withAuth(handler, ['admin']);