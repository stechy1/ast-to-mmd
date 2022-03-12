import { BlockKind } from '../block.kind';
import { ForXDeclarationGraphBlock } from './for-x-declaration.graph-block';
import { GraphBlock } from './graph-block';

export class ForInDeclarationGraphBlock extends ForXDeclarationGraphBlock {
  constructor(id: string, body: GraphBlock[], initializer: GraphBlock, expression: GraphBlock) {
    super(id, body, initializer, expression);
  }

  public override get blockKind(): BlockKind {
    return BlockKind.FOR_IN_DECLARATION;
  }

  protected get operator(): string {
    return 'in';
  }
}
