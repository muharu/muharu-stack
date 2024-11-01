import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { remix } from "remix-hono/handler";
import { env } from "../env";
import { build } from "./build";
import { runServerStartLogger } from "./build/logger";
import { honoServerOptions } from "./config";
import { getLoadContext } from "./context/remix";
import { cache } from "./middleware/cache";
import { apiRoutes } from "./root";

export const app = new Hono();

/**
 * Serve api routes
 */
app.route("/", apiRoutes);

/**
 * Serve assets files from build/client/assets
 */
app.use(
  `/${honoServerOptions.assetsDir}/*`,
  cache(60 * 60 * 24 * 365), // 1 year
  serveStatic({ root: "./build/client" }),
);

/**
 * Serve public files
 */
app.use(
  "*",
  cache(60 * 60), // 1 hour
  serveStatic({
    root: env.NODE_ENV === "production" ? "./build/client" : "./public",
  }),
);

/**
 * Add remix middleware to Hono server
 */
app.use(
  "*",
  remix({
    build,
    mode: env.NODE_ENV,
    getLoadContext,
  }),
);

/**
 * Start the server
 */
runServerStartLogger("Node");
serve({
  port: env.PORT ?? 3000,
  fetch: app.fetch,
});
