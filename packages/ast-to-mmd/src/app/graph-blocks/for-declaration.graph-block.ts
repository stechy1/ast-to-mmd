import { BaseForDeclarationGraphBlock } from './base-for-declaration.graph-block';
import { GraphBlock } from './graph-block';

export class ForDeclarationGraphBlock extends BaseForDeclarationGraphBlock {
  constructor(
    id: string,
    body: GraphBlock[],
    private readonly initBlock: GraphBlock,
    private readonly testBlock: GraphBlock,
    private readonly updateBlock: GraphBlock
  ) {
    super(id, body);
  }

  protected renderCondition(): string {
    return `${this.initBlock.toString()}; ${this.testBlock.toString()}; ${this.updateBlock.toString()}`;
  }
}
