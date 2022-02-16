import { GraphBlock, GraphBlockType } from './graph-block';

export class VariableDeclarationGraphBlock extends GraphBlock {
  constructor(id: string, readonly variableName: string) {
    super(id, GraphBlockType.VARIABLE_DECLARATION);
  }

  public override render(): string {
    return `${this.id}[\\${this.variableName}\\]`;
  }

  override includeInDependencyGraph(): boolean {
    return false;
  }
}
