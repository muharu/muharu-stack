import { buildWithEsbuild } from "./utils/esbuild";

export async function bundleNode(): Promise<void> {
  process.env.NODE_ENV = "production";

  await buildWithEsbuild({
    entryPoint: "./server/hono/node.ts",
    outfileName: "node.js",
    platform: "node",
    format: "esm",
    target: "esnext",
  });
}

bundleNode();
