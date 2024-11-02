import { Context } from "hono";
import { env } from "server/env";

export function getLoadContext(c: Context) {
  return { env, honoContext: c };
}

declare module "@remix-run/node" {
  // eslint-disable-next-line
  interface AppLoadContext extends ReturnType<typeof getLoadContext> {}
}
