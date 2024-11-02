import {
  getExternalsFromPackageJson,
  getFileSize,
  getOutputPath,
  logError,
  logSuccess,
} from "bundler/utils";

export async function bundleBun(): Promise<void> {
  process.env.NODE_ENV = "production";

  logSuccess("→", "Hono Bun Server Build started");

  const externalDeps = getExternalsFromPackageJson();
  const outputPath = getOutputPath("bun.js");
  const startTime = Date.now();

  try {
    await Bun.build({
      entrypoints: ["./server/hono/bun.ts"],
      outdir: "./dist",
      target: "bun",
      external: externalDeps,
      format: "esm",
    });

    const buildTime = Date.now() - startTime;
    const size = await getFileSize(outputPath);

    logSuccess(
      "→",
      `Hono Bun Server Build completed Time: ${buildTime} ms, Size: ${size}`,
    );
  } catch (error) {
    logError("Error during Bun build process:", error);
    throw error;
  }
}

bundleBun();
