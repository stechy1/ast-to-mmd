import { BaseForDeclarationGraphBlock } from './base-for-declaration.graph-block';
import { GraphBlock } from './graph-block';

export abstract class ForXDeclarationGraphBlock extends BaseForDeclarationGraphBlock {
  protected constructor(
    id: string,
    body: GraphBlock,
    protected readonly leftBlock: GraphBlock,
    protected readonly rightBlock: GraphBlock
  ) {
    super(id, body);
  }

  protected override renderCondition(indent: number): string {
    return '';
  }

  protected abstract get conditionFirst(): boolean;
}
