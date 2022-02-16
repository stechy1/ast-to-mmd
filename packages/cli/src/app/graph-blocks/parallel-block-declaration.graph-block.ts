import { BlockDeclarationGraphBlock } from './block-declaration.graph-block';
import { GraphBlock } from './graph-block';

export class ParallelBlockDeclarationGraphBlock extends BlockDeclarationGraphBlock {

  constructor(id: string, childBlocks: GraphBlock[]) {
    super(id, childBlocks);
  }

  protected override renderDependencies(indent: number): string {
    return '';
  }
}
