import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { Context } from "hono";
import superjson from "superjson";

import { env } from "server/env";
import { AppRouter, createCaller } from "server/trpc";

export function getLoadContext(c: Context) {
  const trpcCaller = createCaller({});
  const trpc = trpcFetcher(c.req.raw);
  return { env, trpc, trpcCaller };
}

declare module "@remix-run/node" {
  // eslint-disable-next-line
  interface AppLoadContext extends ReturnType<typeof getLoadContext> {}
}

export const trpcFetcher = (request?: Request) => {
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
