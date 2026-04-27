import { NextRequest, NextResponse } from 'next/server';
import { getAllKeys, createKey, createKeyWithExpiry } from '@/lib/db';
import { generateLicenseKey, generateMultipleKeys } from '@/lib/keys';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'dev-secret-change-in-production';

async function verifyAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (!token) return false;
    try {
      jwt.verify(token, TOKEN_SECRET);
      return true;
    } catch {
      return false;
    }
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const keys = getAllKeys();
    return NextResponse.json({ keys }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { count = 1, label, expiresIn } = body;

    if (!Number.isInteger(count) || count < 1 || count > 100) {
      return NextResponse.json({ error: 'Count must be between 1 and 100' }, { status: 400 });
    }

    let expiresAt: string | undefined;
    if (expiresIn) {
      // expiresIn can be: '30d', '365d', '90d' for 30 days, 1 year, 90 days
      const match = expiresIn.match(/^(\d+)([dmy])$/);
      if (match) {
        const value = parseInt(match[1]);
        const unit = match[2];
        const now = new Date();

        if (unit === 'd') {
          now.setDate(now.getDate() + value);
        } else if (unit === 'm') {
          now.setMonth(now.getMonth() + value);
        } else if (unit === 'y') {
          now.setFullYear(now.getFullYear() + value);
        }

        expiresAt = now.toISOString();
      }
    }

    const newKeys = generateMultipleKeys(count);

    for (const key of newKeys) {
      createKeyWithExpiry(key, label || undefined, expiresAt);
    }

    return NextResponse.json(
      { success: true, keys: newKeys, count, expiresAt: expiresAt || null },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
