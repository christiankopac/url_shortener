import type { Hono } from "hono";
import { shortenUrl, redirectUrl } from "../controllers/shorten";
import type { CustomEnv } from "../types";
import type { BlankSchema } from "hono/types";
import type { schema } from "../db/schema";
import type { LibSQLDatabase } from "drizzle-orm/libsql";

export function registerShortenRoutes(
  app: Hono<CustomEnv, BlankSchema, "/">,
  db: LibSQLDatabase<typeof schema>
) {
  app.post("/shorten", (c) => shortenUrl(c, db));
  app.get("/:shortCode", (c) => redirectUrl(c, db));
}
