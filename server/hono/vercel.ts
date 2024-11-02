import { serveStatic } from "@hono/node-server/serve-static";
import { handle } from "@hono/node-server/vercel";
import { Hono } from "hono";
import { remix } from "remix-hono/handler";
import { env } from "server/env";
import { handleBuild } from "./build";
import { runServerStartLogger } from "./build/logger";
import { honoServerOptions } from "./config";
import { getLoadContext } from "./context/remix";
import { cache } from "./middleware/cache";
import { apiRoutes } from "./root";

const vercelApp = new Hono();

/**
 * Serve api routes
 */
vercelApp.route("/", apiRoutes);

/**
 * Serve assets files from build/client/assets
 */
vercelApp.use(
  `/${honoServerOptions.assetsDir}/*`,
  cache(60 * 60 * 24 * 365), // 1 year
  serveStatic({ root: "./dist/build/client" }),
);

/**
 * Serve public files
 */
vercelApp.use(
  "*",
  cache(60 * 60), // 1 hour
  serveStatic({
    root: env.NODE_ENV === "production" ? "./dist/build/client" : "./public",
  }),
);

/**
 * Add remix middleware to Hono server
 */
vercelApp.use(async (ctx, next) => {
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
runServerStartLogger("Vercel");
export default handle(vercelApp);
