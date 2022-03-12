import { BlockKind } from '../block.kind';
import { BaseCycleDeclarationGraphBlock } from './base-cycle-declaration-graph.block';
import { GraphBlock } from './graph-block';

export class ForDeclarationGraphBlock extends BaseCycleDeclarationGraphBlock {
  constructor(
    id: string,
    body: GraphBlock[],
    private readonly initBlock: GraphBlock,
    private readonly testBlock: GraphBlock,
    private readonly updateBlock: GraphBlock
  ) {
    super(id, body);
  }

  public override get blockKind(): BlockKind {
    return BlockKind.FOR_DECLARATION;
  }

  protected renderCondition(): string {
    return `${this.initBlock.toString()}; ${this.testBlock.toString()}; ${this.updateBlock.toString()}`;
  }
}
