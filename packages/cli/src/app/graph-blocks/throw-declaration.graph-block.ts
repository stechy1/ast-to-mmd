import { GraphBlock, GraphBlockType } from './graph-block';

export class ThrowDeclarationGraphBlock extends GraphBlock {
  constructor(id: string, private readonly exceptionName: string) {
    super(id, GraphBlockType.THROW_STATEMENT);
  }

  public override render(indent: number): string {
    return this.exceptionName;
  }
}
