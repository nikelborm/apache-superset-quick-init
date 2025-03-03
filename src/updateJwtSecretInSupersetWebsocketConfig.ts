import { FileSystem } from '@effect/platform/FileSystem';
import { Path } from '@effect/platform/Path';
import { all, flatMap, fn } from 'effect/Effect';
import {
  Any,
  decode,
  encode,
  NonEmptyString,
  parseJson,
  Record,
} from 'effect/Schema';
import { generateRandomPassword } from './generateRandomPassword.js';

export const updateJwtSecretInSupersetWebsocketConfig = fn(function* (
  basePath: string,
) {
  const fs = yield* FileSystem;
  const path = yield* Path;

  const supersetWebsocketConfigPath = path.join(
    basePath,
    'docker',
    'superset-websocket',
    'config.json',
  );

  const { configFileParsed, jwtSecret } = yield* all(
    {
      configFileParsed: fs
        .readFileString(supersetWebsocketConfigPath, 'utf8')
        .pipe(flatMap(decodeSupersetWebsocketConfig)),
      jwtSecret: generateRandomPassword,
    },
    { concurrency: 'unbounded' },
  );

  const config = yield* encodeSupersetWebsocketConfig({
    ...configFileParsed,
    jwtSecret,
  });

  yield* fs.writeFileString(supersetWebsocketConfigPath, config, {
    mode: 0o600,
  });
});

const SupersetWebsocketConfigSchema = parseJson(
  Record({
    key: NonEmptyString,
    value: Any,
  }),
);

const decodeSupersetWebsocketConfig = decode(SupersetWebsocketConfigSchema);
const encodeSupersetWebsocketConfig = encode(SupersetWebsocketConfigSchema);
