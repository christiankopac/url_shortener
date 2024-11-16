import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export interface AuthInfo {
  userId: number;
  email: string;
}

export async function authMiddleware(c: Context, next: Next) {
  const token = getCookie(c, 'auth_token');
  
  if (!token) {
    return c.redirect('/login');
  }
  
  try {
    const payload = await verify(token, process.env.JWT_SECRET || 'your-secret-key');
    c.set('user', payload as unknown as AuthInfo);
    await next();
  } catch (e) {
    console.error('Auth error:', e);
    return c.redirect('/login');
  }
}
