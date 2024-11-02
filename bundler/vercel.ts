import { buildWithEsbuild } from "./utils/esbuild";

export async function bundleVercel(): Promise<void> {
  process.env.NODE_ENV = "production";

  await buildWithEsbuild({
    entryPoint: "./server/hono/vercel.ts",
    outfileName: "vercel.js",
    platform: "node",
    format: "esm",
    target: "esnext",
  });
}

bundleVercel();
