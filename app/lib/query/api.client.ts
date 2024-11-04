import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { hc } from "hono/client";
import type { ApiRoutes } from "server/hono/root";
import type { AppRouter } from "server/trpc";
import superjson from "superjson";

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/procedure",
      transformer: superjson,
      fetch: (input, init) => {
        return fetch(input, { ...init, credentials: "include" });
      },
    }),
  ],
});

const client = hc<ApiRoutes>("/", {
  fetch: (input: string | URL | Request, init: RequestInit | undefined) => {
    return fetch(input, { ...init, credentials: "include" });
  },
});
const rpc = client.api;

export const api = { trpc, rpc };
