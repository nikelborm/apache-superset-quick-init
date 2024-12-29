import { mkdir } from 'node:fs/promises';

export async function mkdirpAndCd(dir: string) {
  await mkdir(dir, { recursive: true });
  process.chdir(dir);
}
