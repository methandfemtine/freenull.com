import { NextRequest, NextResponse } from 'next/server';
import { toggleKeyStatus, deleteKey } from '@/lib/db';
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { isActive } = body;
    const key = params.key;

    if (typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'isActive must be a boolean' }, { status: 400 });
    }

    toggleKeyStatus(key, isActive);

    return NextResponse.json(
      { success: true, message: `Key ${isActive ? 'activated' : 'deactivated'}` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const key = params.key;
    deleteKey(key);

    return NextResponse.json({ success: true, message: 'Key deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
