import { NextRequest, NextResponse } from 'next/server';
import { getLatestModFile, logDownload, getDownloadSession, markSessionUsed } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: 'No download link provided' }, { status: 400 });
    }

    // Get the download session
    const session = getDownloadSession(token);

    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired download link' }, { status: 401 });
    }

    // Check if already used
    if (session.used) {
      return NextResponse.json({ error: 'Download link has already been used' }, { status: 401 });
    }

    // Check if expired
    const expiresDate = new Date(session.expires_at);
    if (expiresDate < new Date()) {
      return NextResponse.json({ error: 'Download link has expired' }, { status: 401 });
    }

    const modFile = getLatestModFile();

    if (!modFile) {
      return NextResponse.json({ error: 'No mod file available' }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), 'uploads', modFile.filename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found on server' }, { status: 404 });
    }

    // Mark session as used
    markSessionUsed(token);

    // Log the download
    logDownload(session.key_id);

    const fileBuffer = fs.readFileSync(filePath);
    const filename = modFile.filename;

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
