import { env } from "server/env";

export async function importDevelopmentBuild() {
  if (env.NODE_ENV === "production") return;

  const vite = await import("vite");
  const viteDevServer = await vite.createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  return viteDevServer.ssrLoadModule("virtual:remix/server-build");
}
