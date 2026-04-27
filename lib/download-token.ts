import jwt from 'jsonwebtoken';

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'dev-secret-change-in-production';

export function generateDownloadToken(keyId: number): string {
  return jwt.sign(
    { keyId, type: 'download' },
    TOKEN_SECRET,
    { expiresIn: '5m' }
  );
}

export function verifyDownloadToken(token: string): { keyId: number } | null {
  try {
    const decoded = jwt.verify(token, TOKEN_SECRET) as any;
    if (decoded.type !== 'download') return null;
    return { keyId: decoded.keyId };
  } catch {
    return null;
  }
}
