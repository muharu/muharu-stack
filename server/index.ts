import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { remix } from "remix-hono/handler";
import { build } from "./build";
import { cache } from "./middleware";
import { options } from "./options";
import { apiRoutes } from "./root";

const app = new Hono();

/**
 * Serve api routes
 */
app.route("/", apiRoutes);

/**
 * Serve assets files from build/client/assets
 */
app.use(
  `/${options.assetsDir}/*`,
  cache(60 * 60 * 24 * 365), // 1 year
  serveStatic({ root: "./build/client" })
);

/**
 * Serve public files
 */
app.use(
  "*",
  cache(60 * 60),
  serveStatic({
    root: process.env.NODE_ENV === "production" ? "./build/client" : "./public",
  })
); // 1 hour

/**
 * Add remix middleware to Hono server
 */
app.use(
  "*",
  remix({ build, mode: process.env.NODE_ENV as "production" | "development" })
);

Bun.serve({
  port: Number(process.env.PORT) || 3002,
  fetch: app.fetch,
});
