import { getExternalsFromPackageJson } from "bundler/utils";
import chalk from "chalk";
import { promises as fs } from "fs";
import path from "path";

async function buildWithExternals(): Promise<void> {
  const externalDeps = getExternalsFromPackageJson();
  const outputPath = "./dist";
  const outputFile = path.join(outputPath, "bun.js");

  const startTime = Date.now();

  await Bun.build({
    entrypoints: ["./server/hono/bun.ts"],
    outdir: outputPath,
    target: "bun",
    external: externalDeps,
    format: "esm",
  });

  const buildTime = Date.now() - startTime;

  try {
    const stats = await fs.stat(outputFile);
    console.log(
      chalk.green.bold("Hono Bun Server Build completed:") +
        chalk.cyan(` Time: ${buildTime} ms,`) +
        chalk.magenta(` Size: ${(stats.size / 1024).toFixed(2)} KB`),
    );
  } catch (error) {
    console.error(chalk.red("Error retrieving build file size:"), error);
  }
}

buildWithExternals();

export { buildWithExternals as bundleBun };
