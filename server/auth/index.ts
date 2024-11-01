import { type Context } from "hono";
import { getCookie } from "hono/cookie";
import { COOKIE_NAME } from "./constants";
import { deleteSessionTokenCookie, setSessionTokenCookie } from "./cookie";
import { validateSessionToken } from "./session";

export async function validateRequest(ctx: Context) {
  const sessionTokenFromCookie = getCookie(ctx, COOKIE_NAME.SESSION_TOKEN);
  if (!sessionTokenFromCookie) {
    return {
      user: null,
      session: null,
    };
  }

  const { session, user } = await validateSessionToken(sessionTokenFromCookie);
  if (session === null) {
    deleteSessionTokenCookie(ctx);
    return {
      user: null,
      session: null,
    };
  }

  setSessionTokenCookie(ctx, sessionTokenFromCookie, session.expiresAt);

  return { user, session };
}

export type { Session, User } from "./types";
