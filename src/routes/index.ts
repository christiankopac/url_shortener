import type { Hono } from "hono";
import { registerAuthRoutes } from "./auth";
import { registerDashboardRoutes } from "./dashboard";
import { registerShortenRoutes } from "./shorten";
import type { CustomEnv } from "../types";
import type { BlankSchema } from "hono/types";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type { schema } from "../db/schema";


export function registerRoutes(app: Hono<CustomEnv, BlankSchema, "/">, db: LibSQLDatabase<typeof schema>) {
  registerAuthRoutes(app, db);
  registerDashboardRoutes(app, db);
  registerShortenRoutes(app, db);
}
