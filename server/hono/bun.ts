import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { remix } from "remix-hono/handler";
import { env } from "server/env";
import { handleBuild } from "./build";
import { runServerStartLogger } from "./build/logger";
import { honoServerOptions } from "./config";
import { getLoadContext } from "./context/remix";
import { cache } from "./middleware/cache";
import { apiRoutes } from "./root";

export const bunApp = new Hono();

/**
 * Serve api routes
 */
bunApp.route("/", apiRoutes);

/**
 * Serve assets files from build/client/assets
 */
bunApp.use(
  `/${honoServerOptions.assetsDir}/*`,
  cache(60 * 60 * 24 * 365), // 1 year
  serveStatic({ root: "./dist/build/client" }),
);

/**
 * Serve public files
 */
bunApp.use(
  "*",
  cache(60 * 60), // 1 hour
  serveStatic({
    root: env.NODE_ENV === "production" ? "./dist/build/client" : "./public",
  }),
);

/**
 * Add remix middleware to Hono server
 */
bunApp.use(async (ctx, next) => {
  const build = await handleBuild();
  return remix({
    build,
    mode: env.NODE_ENV,
    getLoadContext,
  })(ctx, next);
});

/**
 * Start the server
 */
runServerStartLogger("Bun");
export default {
  port: env.PORT ?? 3000,
  fetch: bunApp.fetch,
};
