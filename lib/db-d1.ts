// Cloudflare D1 database layer
// @ts-ignore
interface Env {
  // @ts-ignore
  DB: D1Database;
  // @ts-ignore
  MOD_BUCKET: R2Bucket;
}

let env: Env;

export function initializeDb(environment: Env) {
  env = environment;
}

export async function getAllKeys() {
  const result = await env.DB.prepare(
    'SELECT * FROM keys ORDER BY created_at DESC'
  ).all();
  return result.results;
}

export async function getKeyById(key: string) {
  const result = await env.DB.prepare(
    'SELECT * FROM keys WHERE key = ? LIMIT 1'
  ).bind(key).first();
  return result;
}

export async function createKey(key: string, label?: string) {
  await env.DB.prepare(
    'INSERT INTO keys (key, label) VALUES (?, ?)'
  ).bind(key, label || null).run();
}

export async function createKeyWithExpiry(key: string, label?: string, expiresAt?: string) {
  await env.DB.prepare(
    'INSERT INTO keys (key, label, expires_at) VALUES (?, ?, ?)'
  ).bind(key, label || null, expiresAt || null).run();
}

export async function toggleKeyStatus(key: string, isActive: boolean) {
  await env.DB.prepare(
    'UPDATE keys SET is_active = ? WHERE key = ?'
  ).bind(isActive ? 1 : 0, key).run();
}

export async function deleteKey(key: string) {
  await env.DB.prepare(
    'DELETE FROM keys WHERE key = ?'
  ).bind(key).run();
}

export async function getLatestModFile() {
  const result = await env.DB.prepare(
    'SELECT * FROM mod_file ORDER BY uploaded_at DESC LIMIT 1'
  ).first();
  return result;
}

export async function recordModFile(filename: string, version?: string) {
  await env.DB.prepare(
    'INSERT INTO mod_file (filename, version) VALUES (?, ?)'
  ).bind(filename, version || null).run();
}

export async function logDownload(keyId: number) {
  await env.DB.prepare(
    'INSERT INTO download_log (key_id) VALUES (?)'
  ).bind(keyId).run();
}

export async function createDownloadSession(keyId: number, sessionToken: string, expiresAt: string) {
  await env.DB.prepare(
    'INSERT INTO download_sessions (key_id, session_token, expires_at) VALUES (?, ?, ?)'
  ).bind(keyId, sessionToken, expiresAt).run();
}

export async function getDownloadSession(sessionToken: string) {
  const result = await env.DB.prepare(
    'SELECT * FROM download_sessions WHERE session_token = ? LIMIT 1'
  ).bind(sessionToken).first();
  return result;
}

export async function markSessionUsed(sessionToken: string) {
  await env.DB.prepare(
    'UPDATE download_sessions SET used = 1 WHERE session_token = ?'
  ).bind(sessionToken).run();
}

export async function initializeDbSchema() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT,
      label TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS mod_file (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      uploaded_at TEXT DEFAULT (datetime('now')),
      version TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS download_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key_id INTEGER REFERENCES keys(id),
      downloaded_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS download_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key_id INTEGER NOT NULL REFERENCES keys(id),
      session_token TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0
    )`
  ];

  for (const stmt of statements) {
    try {
      await env.DB.prepare(stmt).run();
    } catch (e) {
      // Table already exists
    }
  }
}

export function getEnv() {
  return env;
}
