import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "server/env";
import { DbLogger } from "./utils/logger";
import * as schema from "./schema";

const logger = env.NODE_ENV === "development" && new DbLogger();

export const db = drizzle(env.DATABASE_URL, { schema, logger });
