import chalk from "chalk";
import { build } from "esbuild";
import { promises as fs } from "fs";
import path from "path";
import packageJson from "../../package.json";

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
  const outputFile = path.join(outputPath, "node.js");

  const startTime = Date.now();

  try {
    await build({
      entryPoints: ["./server/hono/node.ts"],
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
      chalk.green.bold("Hono Node Server Build completed:") +
        chalk.cyan(` Time: ${buildTime} ms,`) +
        chalk.magenta(` Size: ${(stats.size / 1024).toFixed(2)} KB`),
    );
  } catch (error) {
    console.error(chalk.red("Error during build process:"), error);
  }
}

buildWithExternals();
