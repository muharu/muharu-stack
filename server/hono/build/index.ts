import { env } from "server/env";
import { importDevelopmentBuild } from "./development";
import { importProductionBuild } from "./production";

export const build = await handleBuild();

async function handleBuild() {
  if (env.NODE_ENV === "production") {
    return await importProductionBuild();
  } else {
    return await importDevelopmentBuild();
  }
}
