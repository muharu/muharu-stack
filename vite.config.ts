import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/bun";
import { vitePlugin as remix } from "@remix-run/dev";
import "dotenv/config";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  build: {
    target: "esnext",
  },
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
  },
  define: {
    PUBLIC_BASE_URL: JSON.stringify(process.env.PUBLIC_BASE_URL),
  },
  plugins: [
    devServer({
      adapter,
      injectClientScript: false,
      entry: "server/hono/bun.ts",
      exclude: [`/app/**/*`, `/app/**/.*/**`, /^\/@.+$/, /^\/node_modules\/.*/],
    }),
    remix({
      buildDirectory: "dist/build",
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
});
