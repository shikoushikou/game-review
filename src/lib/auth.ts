import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'gr_token';
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret'
);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function login(password: string): Promise<boolean> {
  if (password !== ADMIN_PASSWORD) return false;

  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(JWT_SECRET);

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return true;
}

export async function logout() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return false;
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function requireAuth() {
  if (!(await isAuthenticated())) {
    redirect('/login');
  }
}
