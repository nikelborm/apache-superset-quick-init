import { randomFillSync } from 'node:crypto';

export function generateRandomPassword(): string {
  return randomFillSync(Buffer.alloc(48)).toString('base64');
}
