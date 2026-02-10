import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { sessionOptions, IronSessionData } from "@/lib/session";
import { loginUser } from "@/services/auth.service";
import { db } from "@/lib/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getIronSession<IronSessionData>(req, res, sessionOptions);
  const { email, password } = req.body;

  try {
    const user = await loginUser(email, password);

    let companyId: string | undefined;
    if (user.role === 'employer') {
      const [rows]: any = await db.query(
        'SELECT company_id FROM company_users WHERE user_id = ? LIMIT 1',
        [user.id]
      );
      if (rows?.length) companyId = rows[0].company_id?.toString();
    }

    session.user = {
      id: user.id.toString(),
      email,
      role: user.role,
      isLoggedIn: true,
      companyId,
    };

    await session.save();

    return res.status(200).json({ message: "Logged in", user: session.user });
  } catch (error: any) {
    if (error?.message === "Invalid credentials") {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}