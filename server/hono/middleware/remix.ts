import type { AppLoadContext, ServerBuild } from "@remix-run/server-runtime";
import { createRequestHandler } from "@remix-run/server-runtime";
import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import type { ServerEnv } from "server/env";

export interface RemixMiddlewareOptions {
  build: ServerBuild;
  mode?: ServerEnv["NODE_ENV"];
  getLoadContext?(c: Context): Promise<AppLoadContext> | AppLoadContext;
}

export function remix({
  mode,
  build,
  getLoadContext = (c) => c.env as unknown as AppLoadContext,
}: RemixMiddlewareOptions) {
  return createMiddleware(async (c) => {
    const requestHandler = createRequestHandler(build, mode);
    const loadContext = getLoadContext(c);
    return await requestHandler(
      c.req.raw,
      loadContext instanceof Promise ? await loadContext : loadContext,
    );
  });
}
