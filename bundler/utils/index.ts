import chalk from "chalk";
import { promises as fs } from "fs";
import path from "path";
import packageJson from "../../package.json";

export function getExternalsFromPackageJson(): string[] {
  const sections: (keyof typeof packageJson)[] = [
    "dependencies",
    "devDependencies",
    // @ts-expect-error - Just in case the packageJson doesn't have the peerDependencies key
    "peerDependencies",
  ];
  const externals: string[] = [];

  for (const section of sections) {
    if (packageJson[section]) {
      externals.push(...Object.keys(packageJson[section]));
    }
  }

  // Removing potential duplicates between dev and peer
  return Array.from(new Set(externals));
}

export function logSuccess(icon: string, details: string) {
  console.log(chalk.green.bold(icon) + chalk.cyan(` ${details}`));
}

export function logError(message: string, error: unknown) {
  console.error(chalk.red(message), error);
}

export async function getFileSize(filePath: string): Promise<string> {
  try {
    const stats = await fs.stat(filePath);
    return `${(stats.size / 1024).toFixed(2)} KB`;
  } catch (error) {
    throw new Error(`Error retrieving file size for ${filePath}: ${error}`);
  }
}

export function getOutputPath(filename: string): string {
  const outputPath = "./dist";
  return path.join(outputPath, filename);
}
