import { randomUUID } from 'crypto';

export function generateLicenseKey(): string {
  const uuid = randomUUID();
  return uuid
    .substring(0, 8) + '-' +
    uuid.substring(9, 13) + '-' +
    uuid.substring(14, 18) + '-' +
    uuid.substring(19, 23) + '-' +
    uuid.substring(24, 36);
}

export function generateMultipleKeys(count: number): string[] {
  return Array.from({ length: count }, () => generateLicenseKey());
}
