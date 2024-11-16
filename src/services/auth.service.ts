import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { schema } from "../db/schema";
import { eq } from "drizzle-orm";
import { AppError } from "../utils/errors";
import { sign } from "hono/jwt";

export class AuthService {
  constructor(private db: LibSQLDatabase<typeof schema>) {}

  async registerUser(email: string, password: string) {
    const existingUser = await this.db.select()
      .from(schema.users)
      .where(eq(schema.users.email, email));

    if (existingUser.length > 0) {
      throw new AppError('Email already registered.', 400, 'DUPLICATE_EMAIL');
    }

    const hashedPassword = await Bun.password.hash(password);
    await this.db.insert(schema.users).values({ email, passwordHash: hashedPassword });

    const [user] = await this.db.select()
      .from(schema.users)
      .where(eq(schema.users.email, email));

    if (!user) {
      throw new AppError('Failed to create user.', 500, 'USER_CREATION_FAILED');
    }

    return this.createToken(user);
  }

  async loginUser(email: string, password: string) {
    const [user] = await this.db.select()
      .from(schema.users)
      .where(eq(schema.users.email, email));
    
    if (!user || !await Bun.password.verify(password, user.passwordHash)) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    return this.createToken(user);
  }

  private async createToken(user: typeof schema.users.$inferSelect) {
    return sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key'
    );
  }
}
