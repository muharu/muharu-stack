import { type Context } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { COOKIE_NAME } from "./constants";

export function setSessionTokenCookie(
  ctx: Context,
  token: string,
  expiresAt: Date,
) {
  setCookie(ctx, COOKIE_NAME.SESSION_TOKEN, token, {
    expires: expiresAt,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function deleteSessionTokenCookie(ctx: Context) {
  deleteCookie(ctx, COOKIE_NAME.SESSION_TOKEN);
}
