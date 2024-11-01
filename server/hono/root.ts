import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { env } from "server/env";
import { appRouter } from "server/trpc";

const app = new Hono().basePath("/api");

export const apiRoutes = app
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
  )
  .get("/hello", (ctx) => {
    return ctx.json({ message: "Hello, World!" });
  });

apiRoutes.use(
  "/procedure/*",
  trpcServer({
    router: appRouter,
    endpoint: "/api/procedure",
  }),
);

export type ApiRoutes = typeof apiRoutes;
