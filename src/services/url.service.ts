import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { schema } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import { generateShortCode } from "../utils/auth";
import type { URLStats } from "../types";

export class UrlService {
  constructor(private db: LibSQLDatabase<typeof schema>) {}

  async createShortUrl(userId: number, originalUrl: string) {
    const shortCode = generateShortCode();
    
    await this.db.insert(schema.urls).values({
      userId,
      originalUrl,
      shortCode,
    });

    return shortCode;
  }

  async getUrlByShortCode(shortCode: string) {
    const [url] = await this.db.select()
      .from(schema.urls)
      .where(eq(schema.urls.shortCode, shortCode))
      .limit(1);
    
    return url;
  }

  async trackVisit(urlId: number, visitorInfo: { ip?: string, userAgent?: string, referrer?: string }) {
    await this.db.insert(schema.analytics).values({
      urlId,
      visitorIp: visitorInfo.ip,
      userAgent: visitorInfo.userAgent,
      referrer: visitorInfo.referrer,
    });
  }

  async getUserUrls(userId: number): Promise<URLStats[]> {
    const userUrls = await this.db
      .select()
      .from(schema.urls)
      .where(eq(schema.urls.userId, userId));

    return Promise.all(
      userUrls.map(async (url) => {
        const [result] = await this.db
          .select({ count: sql`count(*)` })
          .from(schema.analytics)
          .where(eq(schema.analytics.urlId, url.id));

        return {
          ...url,
          clicks: Number(result?.count) || 0,
        };
      })
    );
  }
}
