import { Context } from "hono";

export function getLoadContext(c: Context) {
  const env = process.env;
  return { env, honoContext: c };
}

declare module "@remix-run/node" {
  interface AppLoadContext extends ReturnType<typeof getLoadContext> {}
}
