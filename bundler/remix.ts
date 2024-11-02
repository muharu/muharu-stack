import { execSync } from "child_process";
import { logError, logSuccess } from "./utils";

export function bundleRemix(): void {
  process.env.NODE_ENV = "production";

  try {
    logSuccess("→", "Remix Build started");
    execSync("remix vite:build", { stdio: "inherit" });
    logSuccess("→", "Remix Build completed");
  } catch (error) {
    logError("Error during Remix build process:", error);
    throw error;
  }
}

bundleRemix();
