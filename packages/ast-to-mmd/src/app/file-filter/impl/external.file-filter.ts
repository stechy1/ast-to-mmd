import { SourceFile } from 'ts-morph';

import { FileFilter } from '../file-filter';

/**
 * Implementation of {@link FileFilter} which accept file based on external logic.
 */
export class ExternalFileFilter implements FileFilter {

  private readonly externalFileFilter: FileFilter;

  constructor(externalFileFilterPath: string) {
    this.externalFileFilter = require(externalFileFilterPath);
  }

  public accept(file: SourceFile): boolean {
    return this.externalFileFilter.accept(file);
  }
}
