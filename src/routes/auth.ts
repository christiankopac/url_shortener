import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type { Hono } from "hono";
import type { BlankSchema } from "hono/types";
import { loginUser, logoutUser, registerUser } from "../controllers/auth";
import type { schema } from "../db/schema";
import type { CustomEnv } from "../types";
import { Layout } from "../views/layout";
import { LoginPage } from "../views/pages/loginPage";
import { RegisterPage } from "../views/pages/registerPage";

export function registerAuthRoutes(
  app: Hono<CustomEnv, BlankSchema, "/">,
  db: LibSQLDatabase<typeof schema>
) {
  app.get("/login", (c) => {
    return c.html(Layout({ children: LoginPage() }));
  });
  app.get("/register", (c) => {
    return c.html(Layout({ children: RegisterPage() }));
  });

  app.post("/register", (c) => registerUser(c, db));
  app.post("/login", (c) => loginUser(c, db));
  app.post("/logout", logoutUser);
}
