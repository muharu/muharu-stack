import chalk from "chalk";
import { Logger } from "drizzle-orm";

export class DbLogger implements Logger {
  readonly queryCounts = new Map<
    string,
    { current: number; previous: number; lastExecuted: number }
  >();

  private readonly duplicateThresholdMs = 150; // Adjusted threshold for duplicate detection

  logQuery(query: string, params: unknown[]): void {
    const formattedParams = this.formatParams(params);
    const formattedQuery = this.formatQuery(query);
    const timestamp = this.formatTimestamp(new Date());
    const currentTime = Date.now();

    // Generate a unique identifier for the query
    const queryId = this.generateQueryId(query, params);

    // Get the counts for the query, or initialize them
    const counts = this.queryCounts.get(queryId) ?? {
      current: 0,
      previous: 0,
      lastExecuted: 0,
    };

    // Check for duplicate execution within the threshold
    if (currentTime - counts.lastExecuted < this.duplicateThresholdMs) {
      console.warn(
        chalk.yellowBright.bold(
          `❗ Potential duplicate query: "${formattedQuery}" executed within ${this.duplicateThresholdMs} ms.`,
        ),
      );
    }

    // Increment the current count
    counts.current += 1;

    // Check for a jump in execution count
    if (counts.current - counts.previous >= 2) {
      console.log(chalk.red(`🔁 Query executed ${counts.current} time(s)!`));
    }

    // Update the last executed time
    counts.lastExecuted = currentTime;

    // Update the previous count to the current count
    counts.previous = counts.current;
    this.queryCounts.set(queryId, counts);

    // Log the query details with the timestamp
    console.log(
      chalk.yellow("📜 Executing Query at " + timestamp + ":") +
        "\n" +
        chalk.green.bold(formattedQuery) +
        "\n" +
        chalk.magenta("🔍 Parameters: ") +
        chalk.cyan(formattedParams),
    );
  }

  private formatTimestamp(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };

    const dateString = new Intl.DateTimeFormat("en-US", options).format(date);
    const ms = date.getMilliseconds().toString().padStart(3, "0"); // Ensure 3 digits
    return `${dateString}.${ms}`;
  }

  private generateQueryId(query: string, params: unknown[]): string {
    const serializedParams = this.serializeParams(params);
    return `${query.length}-${JSON.stringify(serializedParams)}`;
  }

  private formatParams(params: unknown[]): string {
    const safeParams = this.serializeParams(params);
    return safeParams.length ? JSON.stringify(safeParams) : "No parameters";
  }

  private serializeParams(params: unknown[]): unknown[] {
    return params.map((param) => {
      if (typeof param === "bigint") {
        return param.toString(); // Convert BigInt to string
      }
      return param; // Return other parameters as-is
    });
  }

  private formatQuery(query: string): string {
    return query
      .replace(/\s+/g, " ") // Normalize whitespace
      .split(
        /(SELECT|FROM|WHERE|INNER JOIN|LEFT JOIN|RIGHT JOIN|ORDER BY|GROUP BY|HAVING|UNION|LIMIT)/i,
      )
      .filter(Boolean) // Remove empty strings
      .map((part) => part.trim()) // Trim each part
      .join("\n") // Join with new lines
      .replace(/([^\n]+)\n/g, "$1\n"); // Ensure clauses remain on their own lines
  }
}
