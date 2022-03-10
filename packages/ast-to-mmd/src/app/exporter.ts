import { writeFileSync } from 'fs';
import * as path from 'path';

import { GraphResult } from './graph-result';


/**
 * Class responsible for exporting generated graph to correct output.
 */
export class Exporter {

  /**
   * Initialize new instance of {@link Exporter}.
   *
   * @param outputRootPath {string} Path to root of output path.
   */
  constructor(private readonly outputRootPath: string) {}

  /**
   * Exports graph results to defined output path.
   *
   * @param graphResults {@link GraphResult[]} Graph results for export.
   */
  public export(graphResults: GraphResult[]): void {

    for (const {graph, sourceFile} of graphResults) {
      const mmdPath = path.resolve(sourceFile.getDirectoryPath(), sourceFile.getBaseNameWithoutExtension()) + '.mmd';
      const fileContent = graph.render(0);
      writeFileSync(mmdPath, fileContent, { encoding: 'utf-8' });
    }

  }
}
