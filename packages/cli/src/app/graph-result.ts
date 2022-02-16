import { SourceFile } from 'ts-morph';

import { GraphBlock } from './graph-blocks/index';

export interface GraphResult {

  sourceFile: SourceFile;
  graph: GraphBlock;

}
