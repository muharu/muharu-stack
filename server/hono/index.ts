import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { remix } from "remix-hono/handler";
import { build } from "./build";
import { runServerStartLogger } from "./build/logger";
import { honoServerOptions } from "./config";
import { getLoadContext } from "./context/remix";
import { cache } from "./middleware/cache";
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
  `/${honoServerOptions.assetsDir}/*`,
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
  remix({
    build,
    mode: process.env.NODE_ENV as "production" | "development",
    getLoadContext,
  })
);

/**
 * Start the server
 */
runServerStartLogger();
export default {
  port: Number(process.env.PORT) || 6969,
  fetch: app.fetch,
};
