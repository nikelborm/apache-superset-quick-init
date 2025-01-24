import { FileSystem } from '@effect/platform/FileSystem';
import { Path } from '@effect/platform/Path';
import { fn } from 'effect/Effect';
import { downloadEntityFromRepo } from 'fetch-github-folder';
import { repo } from './repo.js';

const additionalIntegrationNetwork = `
networks:
  default:
    name: apache_superset_network
`;

export const downloadComposeFileAndAddNewNetworkToIt = fn(function* (
  basePath: string,
  gitRef: string,
) {
  const fs = yield* FileSystem;
  const path = yield* Path;

  const newComposeFilePath = path.join(basePath, 'compose.yml');

  yield* downloadEntityFromRepo({
    pathToEntityInRepo: 'docker-compose-image-tag.yml',
    localPathAtWhichEntityFromRepoWillBeAvailable: newComposeFilePath,
    repo,
    gitRef,
  });

  yield* fs.writeFileString(
    newComposeFilePath,
    additionalIntegrationNetwork,
    { flag: 'a' }, // appends to the end
  );
});
