import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { type ServerBuild } from "@remix-run/node";
import { Hono } from "hono";
import { env } from "../env";
import { handleBuild } from "./build";
import { runServerStartLogger } from "./build/logger";
import { honoServerOptions } from "./config";
import { getLoadContext } from "./context/remix";
import { cache } from "./middleware/cache";
import { remix } from "./middleware/remix";
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
  serveStatic({ root: "./dist/build/client" }),
);

/**
 * Serve public files
 */
nodeApp.use(
  "*",
  cache(60 * 60), // 1 hour
  serveStatic({
    root: env.NODE_ENV === "production" ? "./dist/build/client" : "./public",
  }),
);

/**
 * Add remix middleware to Hono server
 */
nodeApp.use(async (ctx, next) => {
  const build = (await handleBuild()) as ServerBuild;
  return remix({
    build,
    mode: env.NODE_ENV,
    getLoadContext,
  })(ctx, next);
});

/**
 * Start the server
 */
runServerStartLogger("Node");
serve({
  port: env.PORT ?? 3000,
  fetch: nodeApp.fetch,
});
