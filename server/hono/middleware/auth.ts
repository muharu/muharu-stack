import { createMiddleware } from "hono/factory";
import { auth } from "server/auth";

export const authMiddleware = createMiddleware(async (ctx, next) => {
  const { user, session, headers } = await auth.validateRequest(ctx.req.raw);

  ctx.set("user", user);
  ctx.set("session", session);

  headers.forEach((value, key) => {
    ctx.res.headers.append(key, value);
  });

  await next();
});
