import { GraphBlock, GraphBlockType } from './graph-block';
import { Shape } from './render';

export class MethodCallGraphBlock extends GraphBlock {
  constructor(id: string, private readonly methodCallExpression: string) {
    super(id, GraphBlockType.METHOD_CALL);
  }

  public override render(indent: number): string {
    return `${this.generateSpace(indent)}${this.id}${this.renderShape(
      this.methodCallExpression,
      Shape.SUBROUTINE
    )}`;
  }
}
