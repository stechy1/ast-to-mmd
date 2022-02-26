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

  public override get includeInDependencyGraph(): boolean {
    return false;
  }

  public override toString(): string {
    return `${this.lhs.toString()} ${this.operator} ${this.rhs.toString()}`;
  }
}
