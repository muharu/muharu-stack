import { env } from "server/env";

const viteDevServer =
  env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
          appType: "custom",
        }),
      );

export async function importDevelopmentBuild() {
  return viteDevServer?.ssrLoadModule("virtual:remix/server-build");
}
