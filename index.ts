#!/usr/bin/env node

import "@total-typescript/ts-reset";
import { downloadDirAndPutIntoFs } from 'fetch-github-folder';
import { appendFile } from 'fs/promises';
import { downloadSupersetComposeFileIntoCWD, mkdirpAndCd } from "./src/index.js";

await mkdirpAndCd('superset');

await downloadSupersetComposeFileIntoCWD('./compose.yml');

const additionalIntegrationNetwork = `
networks:
  default:
    name: apache_superset_network
`;

await appendFile(
  './compose.yml',
  additionalIntegrationNetwork
);

await mkdirpAndCd('docker');

// await downloadDirAndPutIntoFs({
//   repo: {
//     owner: 'apache',
//     name: 'superset'
//   },
//   localDirPathToPutInsideRepoDirContents: '.',
//   pathToDirectoryInRepo: 'docker'
// })
