import { BlockKind } from '../block.kind';
import { BlockDeclarationGraphBlock } from './block-declaration.graph-block';
import { GraphBlock } from './graph-block';

export class ParallelBlockDeclarationGraphBlock extends BlockDeclarationGraphBlock {
  constructor(id: string, childBlocks: GraphBlock[]) {
    super(id, childBlocks);
  }

  public override get blockKind(): BlockKind {
    return BlockKind.PARALLEL_BLOCK_DECLARATION;
  }

  protected override renderDependencies(_indent: number): string {
    return '';
  }
}
