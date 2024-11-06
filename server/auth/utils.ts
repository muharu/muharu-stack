import { parseCookies, serializeCookie } from "oslo/cookie";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

export function getCookie(request: Request, name: string) {
  const rawCookie = request.headers.get("Cookie");
  if (!rawCookie) return null;
  const cookies = parseCookies(rawCookie);
  return cookies.get(name) ?? null;
}

export function createAuthBlankCoookie(name: string) {
  return serializeCookie(name, "", {
    maxAge: 0,
  });
}

export function createAuthCookie(name: string, value: string, expiresAt: Date) {
  return serializeCookie(name, value, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PRODUCTION,
    expires: new Date(expiresAt),
  });
}

export function createTemporaryAuthCookie(name: string, value: string) {
  const ONE_HOUR = 60 * 60;
  return serializeCookie(name, value, {
    secure: IS_PRODUCTION,
    httpOnly: true,
    sameSite: "lax",
    maxAge: ONE_HOUR,
  });
}

export function getQueryParam(request: Request, key: string) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  return searchParams.get(key);
}
