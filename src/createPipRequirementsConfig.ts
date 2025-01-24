import { FileSystem } from '@effect/platform/FileSystem';
import { Path } from '@effect/platform/Path';
import { all, flatMap } from 'effect/Effect';

export const createPipRequirementsConfig = (basePath: string) =>
  flatMap(all([FileSystem, Path]), ([fs, path]) =>
    fs.writeFileString(
      path.join(basePath, 'docker', 'requirements-local.txt'),
      'psycopg2-binary\npillow\n',
    ),
  );
