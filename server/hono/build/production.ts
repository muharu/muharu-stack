import path from "path";
import { env } from "server/env";
import { honoServerOptions } from "server/hono/config";
import url from "url";

export async function importProductionBuild() {
  if (env.NODE_ENV !== "production") return;
  return await import(
    /* @vite-ignore */
    url
      .pathToFileURL(
        path.resolve(
          path.join(
            process.cwd(),
            `./${honoServerOptions.buildDirectory}/${honoServerOptions.serverBuildFile}`
          )
        )
      )
      .toString()
  );
}
