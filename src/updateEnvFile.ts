import { FileSystem } from '@effect/platform/FileSystem';
import { Path } from '@effect/platform/Path';
import { all, fn } from 'effect/Effect';
import { generateRandomPassword } from './generateRandomPassword.js';

export const updateEnvFile = fn(function* (basePath: string) {
  const fs = yield* FileSystem;
  const path = yield* Path;
  const envFilePath = path.join(basePath, 'docker', '.env');

  const { dbPass, envFile, examplesPass, supersetSecretKey } = yield* all(
    {
      envFile: fs.readFileString(envFilePath, 'utf8'),
      dbPass: generateRandomPassword,
      examplesPass: generateRandomPassword,
      supersetSecretKey: generateRandomPassword,
    },
    { concurrency: 'unbounded' },
  );

  const newEnvFile = envFile
    .replaceAll(/^(DEV_MODE)=.*/gm, '$1=false')
    .replaceAll(/^(FLASK_DEBUG)=.*/gm, '$1=false')
    .replaceAll(/^(SUPERSET_ENV)=.*/gm, '$1=production')
    .replaceAll(/^(SUPERSET_LOAD_EXAMPLES)=.*/gm, '$1=no')
    .replaceAll(/^(ENABLE_PLAYWRIGHT)=.*/gm, '$1=true')
    .replaceAll(/^(PUPPETEER_SKIP_CHROMIUM_DOWNLOAD)=.*/gm, '$1=false')
    .replaceAll(/^(DATABASE_PASSWORD)=.*/gm, `$1="${dbPass}"`)
    .replaceAll(/^(POSTGRES_PASSWORD)=.*/gm, `$1="${dbPass}"`)
    .replaceAll(/^(EXAMPLES_PASSWORD)=.*/gm, `$1="${examplesPass}"`)
    .replaceAll(/^(SUPERSET_SECRET_KEY)=.*/gm, `$1="${supersetSecretKey}"`)
    .replaceAll(
      /# Make sure you set this to a unique secure random value on production\n/g,
      '',
    );

  yield* fs.writeFileString(envFilePath, newEnvFile, { mode: 0o600 });
});
