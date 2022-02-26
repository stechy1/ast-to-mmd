import { GraphBlock } from './graph-block';

export class ThrowDeclarationGraphBlock extends GraphBlock {
  constructor(id: string, private readonly exceptionName: string) {
    super(id);
  }

  public override render(_indent: number): string {
    return this.exceptionName;
  }
}
