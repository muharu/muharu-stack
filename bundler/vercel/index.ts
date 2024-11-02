import { getExternalsFromPackageJson } from "bundler/utils";
import chalk from "chalk";
import { build } from "esbuild";
import { promises as fs } from "fs";
import path from "path";

async function buildWithExternals(): Promise<void> {
  const externalDeps = getExternalsFromPackageJson();
  const outputPath = "./dist";
  const outputFile = path.join(outputPath, "vercel.js");

  const startTime = Date.now();

  try {
    await build({
      entryPoints: ["./server/hono/vercel.ts"],
      bundle: true,
      platform: "node",
      target: "esnext",
      outfile: outputFile,
      external: externalDeps,
      format: "esm",
    });

    const buildTime = Date.now() - startTime;

    const stats = await fs.stat(outputFile);
    console.log(
      chalk.green.bold("Hono Vercel Server Build completed:") +
        chalk.cyan(` Time: ${buildTime} ms,`) +
        chalk.magenta(` Size: ${(stats.size / 1024).toFixed(2)} KB`),
    );
  } catch (error) {
    console.error(chalk.red("Error during build process:"), error);
  }
}

buildWithExternals();

export { buildWithExternals as bundleVercel };
