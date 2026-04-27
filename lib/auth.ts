import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'dev-secret-change-in-production';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSessionToken(): string {
  return jwt.sign(
    { admin: true, iat: Math.floor(Date.now() / 1000) },
    TOKEN_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifySessionToken(token: string): boolean {
  try {
    jwt.verify(token, TOKEN_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function setAdminSession(password: string): Promise<{ success: boolean; token?: string }> {
  if (!ADMIN_PASSWORD_HASH) {
    return { success: false };
  }

  const isValid = await verifyPassword(password, ADMIN_PASSWORD_HASH);
  if (!isValid) {
    return { success: false };
  }

  const token = generateSessionToken();
  const cookieStore = await cookies();
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 86400, // 24 hours
  });

  return { success: true, token };
}

export async function getAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (!token) return false;
    return verifySessionToken(token);
  } catch {
    return false;
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}
