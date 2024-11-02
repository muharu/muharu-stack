import { ServerBuild } from "@remix-run/node";
import path from "path";
import { env } from "server/env";
import { honoServerOptions } from "server/hono/config";
import url from "url";

const productionServer =
  env.NODE_ENV !== "production"
    ? undefined
    : ((await import(
        /* @vite-ignore */
        url
          .pathToFileURL(
            path.resolve(
              path.join(
                process.cwd(),
                `./${honoServerOptions.buildDirectory}/${honoServerOptions.serverBuildFile}`,
              ),
            ),
          )
          .toString()
      )) as ServerBuild);

export async function importProductionBuild() {
  return productionServer;
}
