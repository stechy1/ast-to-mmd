import { ForXDeclarationGraphBlock } from './for-x-declaration.graph-block';
import { GraphBlock } from './graph-block';

export class ForInDeclarationGraphBlock extends ForXDeclarationGraphBlock {
  constructor(id: string, body: GraphBlock[], initializer: GraphBlock, expression: GraphBlock) {
    super(id, body, initializer, expression);
  }

  protected get operator(): string {
    return 'in';
  }
}
