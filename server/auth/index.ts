import { parseCookies, serializeCookie } from "oslo/cookie";
import { env } from "server/env";
import { COOKIE_NAME } from "./constants";
import { validateSessionToken } from "./session";
import type { Session, User } from "./types";

export async function getUserFromCookie(request: Request) {
  const rawCookie = request.headers.get("cookie");
  const headers = new Headers();

  // Return early if no cookies are present
  if (!rawCookie) {
    return { user: null, session: null, headers };
  }

  // Parse cookies and extract the session token
  const parsedCookies = parseCookies(rawCookie);
  const sessionTokenFromCookie = parsedCookies.get(COOKIE_NAME.SESSION_TOKEN);

  // If session token is missing, return early with headers
  if (!sessionTokenFromCookie) {
    return { user: null, session: null, headers };
  }

  // Validate the session token and get session data
  const { session, user } = await validateSessionToken(sessionTokenFromCookie);

  // If session is invalid, clear the session cookie
  if (!session) {
    const clearSessionCookie = serializeCookie(COOKIE_NAME.SESSION_TOKEN, "", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      maxAge: 0, // immediate expiration
    });
    headers.append("Set-Cookie", clearSessionCookie);
    return { user: null, session: null, headers };
  }

  // Set session cookie with updated expiration
  const updatedSessionCookie = serializeCookie(
    COOKIE_NAME.SESSION_TOKEN,
    sessionTokenFromCookie,
    {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      expires: new Date(session.expiresAt),
    },
  );
  headers.append("Set-Cookie", updatedSessionCookie);

  return { user, session, headers };
}

export type { Session, User };
