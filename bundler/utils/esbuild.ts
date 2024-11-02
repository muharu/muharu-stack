import {
  getExternalsFromPackageJson,
  getFileSize,
  getOutputPath,
  logError,
  logSuccess,
} from "bundler/utils";
import { build } from "esbuild";

interface EsbuildOptions {
  entryPoint: string;
  outfileName: string;
  platform: "node" | "browser";
  format: "esm" | "cjs";
  target: string;
}

export async function buildWithEsbuild(options: EsbuildOptions): Promise<void> {
  const { entryPoint, outfileName, platform, format, target } = options;
  const externalDeps = getExternalsFromPackageJson();
  const outputFile = getOutputPath(outfileName);

  logSuccess("→", `${capitalize(platform)}Server Build started`);

  const startTime = Date.now();

  try {
    await build({
      entryPoints: [entryPoint],
      bundle: true,
      platform,
      target,
      outfile: outputFile,
      external: externalDeps,
      format,
    });

    const buildTime = Date.now() - startTime;
    const size = await getFileSize(outputFile);

    logSuccess(
      "→",
      `${capitalize(platform)} Server Build completed Time: ${buildTime} ms, Size: ${size}`,
    );
  } catch (error) {
    logError(`Error during ${platform} build process:`, error);
    throw error; // Re-throw to allow upstream handling if necessary
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
