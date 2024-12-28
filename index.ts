#!/usr/bin/env node

import "@total-typescript/ts-reset";
import { downloadDirAndPutIntoFs } from 'fetch-github-folder';
import { randomFillSync } from 'crypto';
import { appendFile, mkdir } from 'fs/promises';
import { stream } from 'undici';
import { createWriteStream } from 'fs';
// import { pipeline } from 'stream/promises';

function generateRandomPassword() {
  return randomFillSync(Buffer.alloc(48)).toString('base64');
}

async function mkdirpAndCd(dir: string) {
  await mkdir(dir, { recursive: true })
  process.chdir(dir);
}

async function downloadDockerComposeFileIntoCWD() {
  await stream(
    "https://raw.githubusercontent.com/apache/superset/master/docker-compose-image-tag.yml",
    { method: 'GET' },
    (data) => {
      if (data.statusCode !== 200) throw new Error(
        'compose.yml file in apache/superset is not available.'
      );
      return createWriteStream('./compose.yml')
    }
  );
}

await mkdirpAndCd('superset');

await downloadDockerComposeFileIntoCWD();

await appendFile('./compose.yml', `
networks:
  default:
    name: apache_superset_network
`)

await mkdirpAndCd('docker');
// await downloadDirAndPutIntoFs({
//   repo: {
//     owner: 'apache',
//     name: 'superset'
//   },
//   localDirPathToPutInsideRepoDirContents: '.',
//   pathToDirectoryInRepo: 'docker'
// })
