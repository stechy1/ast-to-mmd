import { GraphBlock } from './graph-block';
import { Shape } from './renderer';

export class MethodCallGraphBlock extends GraphBlock {
  constructor(id: string, private readonly methodCallExpression: string) {
    super(id);
  }

  public override render(_indent: number): string {
    return `${this._generateSpace(_indent)}${this.id}${this._renderShape(
      this.methodCallExpression,
      Shape.SUBROUTINE
    )}`;
  }


  public override toString(): string {
    return this.methodCallExpression;
  }
}
