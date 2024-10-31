import { importProductionBuild } from "./production";

export const build = await handleBuild();

async function handleBuild() {
  if (process.env.NODE_ENV === "production") {
    return await importProductionBuild();
  }
}
