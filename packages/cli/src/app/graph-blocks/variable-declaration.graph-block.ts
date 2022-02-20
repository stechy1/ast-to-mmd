import { GraphBlock, GraphBlockType } from './graph-block';
import { Shape } from './render';

export class VariableDeclarationGraphBlock extends GraphBlock {
  constructor(id: string, readonly variableName: string) {
    super(id, GraphBlockType.VARIABLE_DECLARATION);
  }

  public override render(): string {
    return `${this.id}${this.renderShape(this.variableName, Shape.PARALLEOGRAM_ALT)}`;
  }

  override includeInDependencyGraph(): boolean {
    return false;
  }
}
