import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { sessionOptions, IronSessionData } from "@/lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession<IronSessionData>(req, res, sessionOptions);

  if (session.user) {
    return res.json({ ...session.user, isLoggedIn: true });
  } else {
    return res.json({ isLoggedIn: false });
  }
}