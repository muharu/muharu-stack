import { validateSessionToken } from "./session";

export type * from "./oauth/types";

export interface CreateSession {
  token: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
}

type ValidateSessionToken = Awaited<ReturnType<typeof validateSessionToken>>;
export type User = ValidateSessionToken["user"];
export type Session = ValidateSessionToken["session"];
