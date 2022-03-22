import { SourceFile } from 'ts-morph';

/**
 * Interface represents File filter for filtering unwanted files.
 */
export interface FileFilter {

  /**
   * Decides, whether to accept file or not based on internal conditions.
   *
   * @param file {@link SourceFile}.
   * @returns True, when file is accepted, False otherwise.
   */
  accept(file: SourceFile): boolean;

}
