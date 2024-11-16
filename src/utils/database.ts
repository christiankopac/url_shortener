import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { schema } from "../db/schema";

export function setupDatabase() {
  const client = createClient({
    url: process.env.DATABASE_URL || '',
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  return drizzle(client, { schema });
}