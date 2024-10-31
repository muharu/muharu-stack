import chalk from "chalk";
import { promises as fs } from "fs";
import path from "path";
import packageJson from "../package.json";

function getExternalsFromPackageJson(): string[] {
  const sections: (keyof typeof packageJson)[] = [
    "dependencies",
    "devDependencies",
  ];
  const externals: string[] = [];

  for (const section of sections) {
    if (packageJson[section]) {
      externals.push(...Object.keys(packageJson[section]));
    }
  }

  // Removing potential duplicates between dev and peer
  return Array.from(new Set(externals));
}

async function buildWithExternals(): Promise<void> {
  const externalDeps = getExternalsFromPackageJson();
  const outputPath = "./dist";
  const outputFile = path.join(outputPath, "index.js");

  const startTime = Date.now(); // Start time

  await Bun.build({
    entrypoints: ["./server/hono/index.ts"],
    outdir: outputPath,
    target: "bun",
    external: externalDeps,
  });

  const buildTime = Date.now() - startTime;

  try {
    const stats = await fs.stat(outputFile);
    console.log(
      chalk.green.bold("Hono Server Build completed:") +
        chalk.cyan(` Time: ${buildTime} ms,`) +
        chalk.magenta(` Size: ${(stats.size / 1024).toFixed(2)} KB`)
    );
  } catch (error) {
    console.error(chalk.red("Error retrieving build file size:"), error);
  }
}

buildWithExternals();
