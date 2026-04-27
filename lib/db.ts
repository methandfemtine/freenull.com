// @ts-ignore
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'modsite.db');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

export function initializeDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT,
      label TEXT
    );

    CREATE TABLE IF NOT EXISTS mod_file (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      uploaded_at TEXT DEFAULT (datetime('now')),
      version TEXT
    );

    CREATE TABLE IF NOT EXISTS download_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key_id INTEGER REFERENCES keys(id),
      downloaded_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS download_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key_id INTEGER NOT NULL REFERENCES keys(id),
      session_token TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0
    );
  `);

  // Migrate existing database: add expires_at if it doesn't exist
  try {
    const checkColumn = db.prepare("PRAGMA table_info(keys)").all();
    const hasExpiresAt = checkColumn.some((col: any) => col.name === 'expires_at');

    if (!hasExpiresAt) {
      db.exec('ALTER TABLE keys ADD COLUMN expires_at TEXT');
      console.log('✓ Added expires_at column to keys table');
    }
  } catch (e) {
    // Column already exists or migration already done
  }
}

export function getDb() {
  return db;
}

export function getAllKeys() {
  const stmt = db.prepare('SELECT * FROM keys ORDER BY created_at DESC');
  return stmt.all();
}

export function getKeyById(key: string) {
  const stmt = db.prepare('SELECT * FROM keys WHERE key = ? LIMIT 1');
  return stmt.get(key) as { id: number; key: string; is_active: number; created_at: string; expires_at?: string; label?: string } | undefined;
}

export function createKey(key: string, label?: string) {
  const stmt = db.prepare('INSERT INTO keys (key, label) VALUES (?, ?)');
  stmt.run(key, label || null);
}

export function createKeyWithExpiry(key: string, label?: string, expiresAt?: string) {
  const stmt = db.prepare('INSERT INTO keys (key, label, expires_at) VALUES (?, ?, ?)');
  stmt.run(key, label || null, expiresAt || null);
}

export function toggleKeyStatus(key: string, isActive: boolean) {
  const stmt = db.prepare('UPDATE keys SET is_active = ? WHERE key = ?');
  stmt.run(isActive ? 1 : 0, key);
}

export function deleteKey(key: string) {
  const stmt = db.prepare('DELETE FROM keys WHERE key = ?');
  stmt.run(key);
}

export function getLatestModFile() {
  const stmt = db.prepare('SELECT * FROM mod_file ORDER BY uploaded_at DESC LIMIT 1');
  return stmt.get() as { id: number; filename: string; uploaded_at: string; version?: string } | undefined;
}

export function recordModFile(filename: string, version?: string) {
  const stmt = db.prepare('INSERT INTO mod_file (filename, version) VALUES (?, ?)');
  stmt.run(filename, version || null);
}

export function logDownload(keyId: number) {
  const stmt = db.prepare('INSERT INTO download_log (key_id) VALUES (?)');
  stmt.run(keyId);
}

export function createDownloadSession(keyId: number, sessionToken: string, expiresAt: string) {
  const stmt = db.prepare(
    'INSERT INTO download_sessions (key_id, session_token, expires_at) VALUES (?, ?, ?)'
  );
  stmt.run(keyId, sessionToken, expiresAt);
}

export function getDownloadSession(sessionToken: string) {
  const stmt = db.prepare(
    'SELECT * FROM download_sessions WHERE session_token = ? LIMIT 1'
  );
  return stmt.get(sessionToken) as {
    id: number;
    key_id: number;
    session_token: string;
    created_at: string;
    expires_at: string;
    used: number;
  } | undefined;
}

export function markSessionUsed(sessionToken: string) {
  const stmt = db.prepare('UPDATE download_sessions SET used = 1 WHERE session_token = ?');
  stmt.run(sessionToken);
}

initializeDb();
