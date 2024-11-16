import type { Context } from "hono";
import { generateShortCode } from "../utils/auth";
import type { AuthInfo } from "../middleware/auth";
import { schema } from "../db/schema";
import { eq } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";

export async function shortenUrl(c: Context, db: LibSQLDatabase<typeof schema> ) {
  const { url } = await c.req.parseBody<{ url: string }>();
  const user = c.get('user') as AuthInfo;
  
  const shortCode = generateShortCode();
  
  try {
    await db.insert(schema.urls).values({
      userId: user.userId,
      originalUrl: url,
      shortCode,
    });
    
    const shortUrl = `${c.req.url}/${shortCode}`;
    
    return c.html(`
      <div class="p-4 bg-green-100 text-green-700 rounded">
        <p>Short URL created:</p>
        <a href="${shortUrl}" class="underline" target="_blank">${shortUrl}</a>
      </div>
    `);
  } catch (error) {
    return c.html(`
      <div class="p-4 bg-red-100 text-red-700 rounded">
        Failed to create short URL. Please try again.
      </div>
    `);
  }
}

export async function redirectUrl(c: Context, db: LibSQLDatabase<typeof schema>) {
  const shortCode = c.req.param("shortCode");
  
  const url = await db.select()
    .from(schema.urls)
    .where(eq(schema.urls.shortCode, shortCode))
    .limit(1);
    
  if (!url.length) {
    return c.notFound();
  }
  
  // Track analytics
  await db.insert(schema.analytics).values({
    urlId: url[0].id,
    visitorIp: c.req.header("x-forwarded-for") || c.req.header("x-real-ip"),
    userAgent: c.req.header("user-agent"),
    referrer: c.req.header("referer"),
  });
  
  return c.redirect(url[0].originalUrl);
}