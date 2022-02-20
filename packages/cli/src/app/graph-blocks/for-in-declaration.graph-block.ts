import { ForXDeclarationGraphBlock } from './for-x-declaration.graph-block';
import { GraphBlock } from './graph-block';

export class ForInDeclarationGraphBlock extends ForXDeclarationGraphBlock {
  constructor(id: string, body: GraphBlock, leftBlock: GraphBlock, rightBlock: GraphBlock) {
    super(id, body, leftBlock, rightBlock);
  }

  protected get conditionFirst(): boolean {
    return false;
  }
}
