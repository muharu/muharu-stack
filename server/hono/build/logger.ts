import chalk from "chalk";

export function runServerStartLogger(runtime: "Bun" | "Node") {
  console.log(`
${chalk.black.bold("🔥 Hono Server Status")}
${chalk.green.bold("→")} ${chalk.white("Port:")} ${chalk.blue.bold(
    Number(process.env.PORT) || 6969
  )}
${chalk.green.bold("→")} ${chalk.white("Runtime:")} ${chalk.yellow.bold(
    runtime
  )}
${chalk.green.bold("→")} ${chalk.white("Environment:")} ${chalk.cyan.bold(
    process.env.NODE_ENV || "development"
  )}
`);
}
