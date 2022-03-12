import { BaseCycleDeclarationGraphBlock } from './base-cycle-declaration-graph.block';
import { GraphBlock } from './graph-block';

export abstract class ForXDeclarationGraphBlock extends BaseCycleDeclarationGraphBlock {
  protected constructor(
    id: string,
    body: GraphBlock[],
    protected readonly initializer: GraphBlock,
    protected readonly expression: GraphBlock
  ) {
    super(id, body);
  }

  protected override renderCondition(): string {
    return `${this.initializer.toString()} ${this.operator} ${this.expression.toString()}`;
  }

  protected abstract get operator(): string;
}
