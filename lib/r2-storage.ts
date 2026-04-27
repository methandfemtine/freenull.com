// Cloudflare R2 file storage
// @ts-ignore
interface Env {
  // @ts-ignore
  MOD_BUCKET: R2Bucket;
}

let env: Env;

export function initializeR2(environment: Env) {
  env = environment;
}

const MOD_FILE_KEY = 'mod_current';

export async function uploadModFile(file: File): Promise<string> {
  const filename = file.name;
  const buffer = await file.arrayBuffer();

  // Upload to R2
  await env.MOD_BUCKET.put(MOD_FILE_KEY, buffer, {
    httpMetadata: {
      contentType: file.type || 'application/octet-stream',
      contentDisposition: `attachment; filename="${filename}"`,
    },
  });

  return filename;
}

export async function getLatestModFile(): Promise<{ buffer: ArrayBuffer; filename: string } | null> {
  const object = await env.MOD_BUCKET.get(MOD_FILE_KEY);

  if (!object) {
    return null;
  }

  const buffer = await object.arrayBuffer();
  const filename = object.httpMetadata?.contentDisposition?.split('"')[1] || 'mod_file.zip';

  return { buffer, filename };
}

export function getEnv() {
  return env;
}
