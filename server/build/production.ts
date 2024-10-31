import path from "path";
import { options } from "server/options";
import url from "url";

export async function importProductionBuild() {
  return await import(
    /* @vite-ignore */
    url
      .pathToFileURL(
        path.resolve(
          path.join(
            process.cwd(),
            `./${options.buildDirectory}/${options.serverBuildFile}`
          )
        )
      )
      .toString()
  );
}
