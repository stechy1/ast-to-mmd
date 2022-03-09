import { BaseForDeclarationGraphBlock } from './base-for-declaration.graph-block';
import { GraphBlock } from './graph-block';

export abstract class ForXDeclarationGraphBlock extends BaseForDeclarationGraphBlock {
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
