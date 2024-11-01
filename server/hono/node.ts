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

export const nodeApp = new Hono();

/**
 * Serve api routes
 */
nodeApp.route("/", apiRoutes);

/**
 * Serve assets files from build/client/assets
 */
nodeApp.use(
  `/${honoServerOptions.assetsDir}/*`,
  cache(60 * 60 * 24 * 365), // 1 year
  serveStatic({ root: "./build/client" }),
);

/**
 * Serve public files
 */
nodeApp.use(
  "*",
  cache(60 * 60), // 1 hour
  serveStatic({
    root: env.NODE_ENV === "production" ? "./build/client" : "./public",
  }),
);

/**
 * Add remix middleware to Hono server
 */
nodeApp.use(
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
  fetch: nodeApp.fetch,
});
