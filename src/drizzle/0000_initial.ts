// drizzle/0000_initial.ts
import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export async function up(db) {
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    
    CREATE INDEX idx_users_email ON users(email);
  `);
}

export async function down(db) {
  await db.run(sql`DROP TABLE IF EXISTS users;`);
}
