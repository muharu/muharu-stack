import chalk from "chalk";
import { env } from "server/env";

export function runServerStartLogger(runtime: "Bun" | "Node") {
  console.log(`
${chalk.black.bold("🔥 Hono Server Status")}
${chalk.green.bold("→")} ${chalk.white("Port:")} ${chalk.blue.bold(
    env.PORT ?? 3000,
  )}
${chalk.green.bold("→")} ${chalk.white("Runtime:")} ${chalk.yellow.bold(
    runtime,
  )}
${chalk.green.bold("→")} ${chalk.white("Environment:")} ${chalk.cyan.bold(
    env.NODE_ENV ?? "development",
  )}
`);
}
