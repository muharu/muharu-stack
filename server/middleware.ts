import type { MiddlewareHandler } from "hono";

export function cache(seconds: number): MiddlewareHandler {
  return async (ctx, next) => {
    if (
      !/\.[a-zA-Z0-9]+$/.exec(ctx.req.path) ||
      ctx.req.path.endsWith(".data")
    ) {
      return next();
    }
    await next();
    if (!ctx.res.ok) {
      return;
    }
    ctx.res.headers.set("cache-control", `public, max-age=${seconds}`);
  };
}
