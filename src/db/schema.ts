import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const urls = sqliteTable("urls", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  originalUrl: text("original_url").notNull(),
  shortCode: text("short_code").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export const analytics = sqliteTable("analytics", {
  id: integer("id").primaryKey(),
  urlId: integer("url_id").references(() => urls.id),
  visitorIp: text("visitor_ip"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull().defaultNow(),
});

export const schema = { users, urls, analytics };