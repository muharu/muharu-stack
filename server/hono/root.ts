import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { env } from "server/env";
import { appRouter, createTRPCContext } from "server/trpc";

const restApiApp = new Hono().basePath("/api");

export const apiRoutes = restApiApp
  .use(
    "*",
    cors({
      origin: env.NODE_ENV !== "production" ? "*" : [env.PUBLIC_BASE_URL],
      credentials: true,
    }),
  )
  .use(
    "*",
    csrf({
      origin: env.NODE_ENV !== "production" ? "*" : [env.PUBLIC_BASE_URL],
    }),
  );

apiRoutes.use(
  "/procedure/*",
  trpcServer({
    router: appRouter,
    createContext: createTRPCContext,
    endpoint: "/api/procedure",
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
  }),
);

export type ApiRoutes = typeof apiRoutes;
