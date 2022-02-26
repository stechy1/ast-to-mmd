import { SourceFile } from 'ts-morph';

import { GraphBlock } from './graph-blocks';

/**
 * Interface representing one Graph result
 */
export interface GraphResult {
  sourceFile: SourceFile;
  graph: GraphBlock;
}
