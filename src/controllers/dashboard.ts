import type { Context } from "hono";
import { Layout } from "../views/layout";
import { schema } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { html } from "hono/html";
import type { AuthInfo } from "../middleware/auth";
import type { URLStats } from "../types";
import { HomePage } from "../views/pages/homePage";
import { AppError, handleError } from "../utils/errors";

export async function showDashboard(c: Context, db: LibSQLDatabase<typeof schema>) {
  const user = c.get("user") as AuthInfo;

  if (!user?.userId) {
    return c.redirect("/login");
  }

  try {
    const userUrls = await db
      .select()
      .from(schema.urls)
      .where(eq(schema.urls.userId, user.userId));

    const urlStats: URLStats[] = await Promise.all(
      userUrls.map(async (url) => {
        const [result] = await db
          .select({ count: sql`count(*)` })
          .from(schema.analytics)
          .where(eq(schema.analytics.urlId, url.id));

        return {
          ...url,
          clicks: Number(result?.count) || 0,
        };
      })
    );

    return c.html(Layout({
      user,
      children: renderDashboardContent(urlStats)
    }));
  } catch (error) {
    return handleError(c, error);
  }
}

export async function showHome(c: Context, db: LibSQLDatabase<typeof schema>) {
  const user = c.get("user") as AuthInfo | undefined;
  return c.html(
    Layout({
      user,
      children: HomePage({ user }),
    })
  );
}
