import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { appRouter } from "server/trpc";

const app = new Hono();

export const apiRoutes = app.basePath("/api").get("/hello", (ctx) => {
  return ctx.json({ message: "Hello, World!" });
});

apiRoutes.use(
  "/procedure/*",
  trpcServer({
    router: appRouter,
    endpoint: "/api/procedure",
  })
);

export type ApiRoutes = typeof apiRoutes;
