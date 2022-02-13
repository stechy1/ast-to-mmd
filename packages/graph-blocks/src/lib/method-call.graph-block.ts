import { GraphBlock, GraphBlockType } from './graph-block';

export class MethodCallGraphBlock extends GraphBlock {
  constructor(private readonly methodCallExpression: string) {
    super(GraphBlockType.METHOD_CALL);
  }

  public override render(indent: number): string {
    return `${this.generateSpace(indent)}${this.id}[["${
      this.methodCallExpression
    }"]]`;
  }
}
