import { stream } from 'undici';
import { createWriteStream } from 'node:fs';

export async function downloadSupersetComposeFileIntoCWD(
  filePath: string
): Promise<void> {
  await stream(
    "https://raw.githubusercontent.com/apache/superset/master/docker-compose-image-tag.yml",
    { method: 'GET' },
    (data) => {
      if (data.statusCode !== 200) throw new Error(
        'docker-compose-image-tag.yml in apache/superset repo is not available.'
      );
      return createWriteStream(filePath)
    }
  );
}
