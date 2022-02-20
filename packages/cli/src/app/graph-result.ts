import { SourceFile } from 'ts-morph';

import { GraphBlock } from './graph-blocks';

export interface GraphResult {
  sourceFile: SourceFile;
  graph: GraphBlock;
}
