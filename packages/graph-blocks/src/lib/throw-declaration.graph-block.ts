import { GraphBlock, GraphBlockType } from './graph-block';

export class ThrowDeclarationGraphBlock extends GraphBlock {
  constructor(private readonly exceptionName: string) {
    super(GraphBlockType.THROW_STATEMENT);
  }

  public override render(indent: number): string {
    return this.exceptionName;
  }
}
