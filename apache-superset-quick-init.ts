#!/usr/bin/env node

import { CliConfig } from '@effect/cli';
import { make, run } from '@effect/cli/Command';
import { layer as NodeFileSystemLayer } from '@effect/platform-node-shared/NodeFileSystem';
import { layer as NodePathLayer } from '@effect/platform-node-shared/NodePath';
import { runMain } from '@effect/platform-node-shared/NodeRuntime';
import { layer as NodeTerminalLayer } from '@effect/platform-node-shared/NodeTerminal';
import { FileSystem } from '@effect/platform/FileSystem';
import { Path } from '@effect/platform/Path';
import { all, andThen, gen, provide } from 'effect/Effect';
import { pipe } from 'effect/Function';
import {
  destinationPathCLIOptionBackedByEnv,
  downloadEntityFromRepo,
  gitRefCLIOptionBackedByEnv,
  OctokitLayer,
} from 'fetch-github-folder';
import {
  createPipRequirementsConfig,
  downloadComposeFileAndAddNewNetworkToIt,
  repo,
  updateEnvFile,
  updateJwtSecretInSupersetWebsocketConfig,
} from './src/index.js';

// Those values updated automatically. If you edit names of constants or
// move them to a different file, update ./scripts/build.sh
const PACKAGE_VERSION = '0.1.0';
const PACKAGE_NAME = 'apache-superset-quick-init';

const appCommand = make(
  PACKAGE_NAME,
  {
    destinationPath: destinationPathCLIOptionBackedByEnv,
    gitRef: gitRefCLIOptionBackedByEnv,
  },
  ({ gitRef, destinationPath }) =>
    gen(function* () {
      const fs = yield* FileSystem;
      const path = yield* Path;

      yield* fs.makeDirectory(destinationPath, {
        recursive: true,
      });

      yield* all(
        [
          downloadComposeFileAndAddNewNetworkToIt(destinationPath, gitRef),
          downloadEntityFromRepo({
            pathToEntityInRepo: 'docker',
            localPathAtWhichEntityFromRepoWillBeAvailable: path.join(
              destinationPath,
              'docker',
            ),
            repo,
            gitRef,
          }).pipe(
            andThen(
              all(
                [
                  updateJwtSecretInSupersetWebsocketConfig(destinationPath),
                  updateEnvFile(destinationPath),
                  createPipRequirementsConfig(destinationPath),
                ],
                { concurrency: 'unbounded' },
              ),
            ),
          ),
        ],
        { concurrency: 'unbounded' },
      );
    }),
);

const cli = run(appCommand, {
  // those values will be filled automatically from package.json
  name: PACKAGE_NAME,
  version: PACKAGE_VERSION,
});

pipe(
  process.argv,
  cli,
  provide(NodeFileSystemLayer),
  provide(NodePathLayer),
  provide(NodeTerminalLayer),
  provide(CliConfig.layer({ showTypes: false })),
  provide(
    OctokitLayer({
      // auth: getEnvVarOrFail('GITHUB_ACCESS_TOKEN'),
    }),
  ),
  runMain,
);
