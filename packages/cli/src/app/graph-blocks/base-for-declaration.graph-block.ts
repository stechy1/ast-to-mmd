import { GraphBlock, GraphBlockType } from './graph-block';

export abstract class BaseForDeclarationGraphBlock extends GraphBlock {
  protected constructor(id: string, protected readonly body: GraphBlock) {
    super(id, GraphBlockType.FOR_STATEMENT);
  }

  public override render(indent: number): string {
    return '';
  }

  protected abstract renderCondition(indent: number): string;

  protected renderBody(indent: number): string {
    return this.body.render(indent);
  }
}
