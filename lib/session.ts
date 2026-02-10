import { SessionOptions } from "iron-session";

export interface UserSession {
  id: string;
  email: string;
  role: string;
  isLoggedIn: boolean;
  companyId?: string;
}

// 1. Define the interface
export interface IronSessionData {
  user?: UserSession;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: "job_board_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};