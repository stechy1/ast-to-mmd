import { SourceFile } from 'ts-morph';

import { FileFilter } from '../file-filter';

/**
 * Implementation of {@link FileFilter} which accept every file.
 */
export class AcceptAllFileFilter implements FileFilter {
  public accept(_file: SourceFile): boolean {
    return true;
  }
}
