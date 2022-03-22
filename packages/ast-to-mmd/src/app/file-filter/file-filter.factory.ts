import * as fs from 'fs';
import * as path from 'path';

import { FileFilter } from './file-filter';
import { AcceptAllFileFilter } from './impl/accept-all.file-filter';
import { ConstraintFileFilter } from './impl/constraint.file-filter';
import { ExternalFileFilter } from './impl/external.file-filter';

export class FileFilterFactory {

  public create(cwd: string, configPath: string): FileFilter {
    if (!configPath) {
      return new AcceptAllFileFilter();
    }

    const absoluteConfigPath = path.join(cwd, configPath);
    if (!fs.existsSync(absoluteConfigPath)) {
      throw new Error('File on config path does not exists!')
    }

    if (absoluteConfigPath.endsWith('.json')) {
      const fileContent = fs.readFileSync(absoluteConfigPath, { encoding: 'utf-8' });
      return new ConstraintFileFilter(JSON.parse(fileContent));
    }

    if (absoluteConfigPath.endsWith('.js')) {
      return new ExternalFileFilter(absoluteConfigPath);
    }

    throw new Error('Unsupported file!')
  }

}
