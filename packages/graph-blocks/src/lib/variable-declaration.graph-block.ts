import { GraphBlock, GraphBlockType } from './graph-block';

export class VariableDeclarationGraphBlock extends GraphBlock {
  constructor(readonly variableName: string) {
    super(GraphBlockType.VARIABLE_DECLARATION);
  }

  public override render(): string {
    return `${this.id}[\\${this.variableName}\\]`;
  }
}
