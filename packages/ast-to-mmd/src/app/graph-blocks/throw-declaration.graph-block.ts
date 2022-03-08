import { BaseExitDeclarationGraphBlock } from './base-exit-declaration.graph-block';
import { Shape } from './renderer';

export class ThrowDeclarationGraphBlock extends BaseExitDeclarationGraphBlock {
  constructor(id: string, private readonly exceptionName: string) {
    super(id);
  }

  public override render(_indent: number): string {
    return `${this._generateSpace(_indent)}${this.id}${this._renderShape(
      this.exceptionName,
      Shape.PARALLEOGRAM_ALT
    )}`;
  }
}
