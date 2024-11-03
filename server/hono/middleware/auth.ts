import { createMiddleware } from "hono/factory";
import { getUserFromCookie } from "server/auth";

export const auth = createMiddleware(async (ctx, next) => {
  const { user, session, headers } = await getUserFromCookie(ctx.req.raw);

  ctx.set("user", user);
  ctx.set("session", session);

  headers.forEach((value, key) => {
    ctx.res.headers.append(key, value);
  });

  await next();
});
