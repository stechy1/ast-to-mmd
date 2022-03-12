import { BlockKind } from '../block.kind';
import { GraphBlock } from './graph-block';

export class BinaryExpressionDeclarationGraphBlock extends GraphBlock {
  constructor(
    id: string,
    private readonly lhs: GraphBlock,
    private readonly rhs: GraphBlock,
    private readonly operator: string
  ) {
    super(id);
  }

  public override render(_indent: number): string {
    return '';
  }

  public override get blockKind(): BlockKind {
    return BlockKind.BINARY_EXPRESSION_DECLARATION;
  }

  public override get includeInDependencyGraph(): boolean {
    return false;
  }

  public override toString(): string {
    return `${this.lhs.toString()} ${this.operator} ${this.rhs.toString()}`;
  }
}
