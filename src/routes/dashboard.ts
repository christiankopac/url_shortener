import type { Hono } from "hono";
import { showDashboard, showHome } from "../controllers/dashboard";
import type { CustomEnv } from "../types";
import type { BlankSchema } from "hono/types";
import type { schema } from "../db/schema";
import type { LibSQLDatabase } from "drizzle-orm/libsql";

export function registerDashboardRoutes(
  app: Hono<CustomEnv, BlankSchema, "/">,
  db: LibSQLDatabase<typeof schema>
) {
  app.get("/dashboard", (c) => showDashboard(c, db));
  app.get("/", (c) => showHome(c, db));
}
