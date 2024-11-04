import { remember } from "@epic-web/remember";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "server/env";
import * as schema from "./schema";
import { DbLogger } from "./utils/logger";

const logger = env.NODE_ENV === "development" && new DbLogger();

export const db = remember("drizzle", () =>
  drizzle(env.DATABASE_URL, { schema, logger }),
);
