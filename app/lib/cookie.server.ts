import { parseCookies } from "oslo/cookie";

export function getCookie(request: Request, name: string) {
  const rawCookie = request.headers.get("Cookie");
  if (!rawCookie) return null;
  const cookies = parseCookies(rawCookie);
  return cookies.get(name) ?? null;
}
