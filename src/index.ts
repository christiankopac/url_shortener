import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import { authMiddleware, type AuthInfo } from "./middleware/auth";
import { setupDatabase } from "./utils/database";
import { registerRoutes } from "./routes";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type { schema } from "./db/schema";

type CustomEnv = {
  Variables: {
    user?: AuthInfo;
  };
};

const app = new Hono<CustomEnv>();

// Database setup
const db: LibSQLDatabase<typeof schema> = setupDatabase();

// Middleware
app.use("*", csrf());
app.use("*", logger());
app.use("/dashboard/*", authMiddleware);
app.use("/shorten", authMiddleware);

// Register routes
registerRoutes(app, db);

export default {
  port: 3000,
  fetch: app.fetch,
};
