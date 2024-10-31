import { Hono } from "hono";

const app = new Hono();

export const apiRoutes = app.basePath("/api").get("/hello", (ctx) => {
  return ctx.json({ message: "Hello, World!" });
});

export type ApiRoutes = typeof apiRoutes;
