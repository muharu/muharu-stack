import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { Context } from "hono";
import superjson from "superjson";

import { env } from "server/env";
import { AppRouter, createCaller } from "server/trpc";

export function getLoadContext(c: Context) {
  const caller = createCaller({
    honoCtx: c,
  });
  const api = fetchTRPCProcedure(c.req.raw);
  const trpc = { api, caller };
  return { env, trpc };
}

declare module "@remix-run/node" {
  // eslint-disable-next-line
  interface AppLoadContext extends ReturnType<typeof getLoadContext> {}
}

export const fetchTRPCProcedure = (request?: Request) => {
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${env.PUBLIC_BASE_URL}/api/procedure`,
        headers: () => {
          const cookie = request?.headers.get("Cookie") ?? "";
          return { cookie };
        },
        transformer: superjson,
      }),
    ],
  });
};
