import { NextRequest, NextResponse } from 'next/server';
import { getKeyById, createDownloadSession } from '@/lib/db';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key || typeof key !== 'string') {
      return NextResponse.json({ error: 'Invalid key provided' }, { status: 400 });
    }

    const keyData = getKeyById(key);

    if (!keyData || !keyData.is_active) {
      return NextResponse.json({ error: 'Invalid or inactive license key' }, { status: 401 });
    }

    // Check if key has expired
    if (keyData.expires_at) {
      const expiresDate = new Date(keyData.expires_at);
      if (expiresDate < new Date()) {
        return NextResponse.json({ error: 'License key has expired' }, { status: 401 });
      }
    }

    // Create a unique, one-time-use download session
    const sessionToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(); // 1 hour

    createDownloadSession(keyData.id, sessionToken, expiresAt);

    return NextResponse.json(
      { success: true, downloadUrl: `/api/download/${sessionToken}`, key: keyData.key },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
