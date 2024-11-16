import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import { FailedLoginMessage, InvalidLoginMessage, SuccesfulLoginMessage } from "../views/components/auth";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { AppError, handleError } from "../utils/errors";
import { eq } from "drizzle-orm";
import { AuthService } from "../services/auth.service";
import { schema } from "../db/schema";
import { sign } from "hono/jwt";
import type { CookieOptions } from "hono/utils/cookie";

const COOKIE_CONFIG: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Lax',
  maxAge: 60 * 60 * 24 * 7, // 1 week
};

export async function registerUser(c: Context, db: LibSQLDatabase<typeof schema>) {
  try {
    const { email, password } = await c.req.parseBody() as { email: string; password: string };

    if (!email || !password) {
      throw new AppError('Email and password are required.', 400, 'VALIDATION_ERROR');
    }

    const authService = new AuthService(db);
    const token = await authService.registerUser(email, password);
    
    setCookie(c, 'auth_token', token, COOKIE_CONFIG);

    return c.html(`
      <div class="mt-4 p-4 bg-green-100 text-green-700 rounded">
        Registration successful! Redirecting to dashboard...
        <script>
          setTimeout(() => window.location.href = '/dashboard', 1000);
        </script>
      </div>
    `);
  } catch (error) {
    return handleError(c, error);
  }
}

export async function loginUser(c: Context, db: LibSQLDatabase<typeof schema>) {
  try {
    const { email, password } = await c.req.parseBody() as { email: string; password: string };
    
    const [user] = await db.select()
      .from(schema.users)
      .where(eq(schema.users.email, email));
    
    if (!user) {
      return c.html(InvalidLoginMessage());
    }
    
    const valid = await Bun.password.verify(password, user.passwordHash);
    
    if (!valid) {
      return c.html(InvalidLoginMessage());
    }
    
    const token = await sign(
      { 
        userId: user.id, 
        email: user.email 
      }, 
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    setCookie(c, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    
    return c.html(SuccesfulLoginMessage());
  } catch (error) {
    console.error('Login error:', error);
    return c.html(FailedLoginMessage(error as Error));
  }
}

export async function logoutUser(c: Context) {
  setCookie(c, 'auth_token', '', { maxAge: 0 });
  return c.redirect('/');
}