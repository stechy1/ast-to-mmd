import { GraphBlock } from './graph-block';
import { Shape } from './renderer';

export class VariableDeclarationGraphBlock extends GraphBlock {
  constructor(id: string, private readonly variableName: string, private readonly initializer?: GraphBlock) {
    super(id);
  }

  public override render(_indent: number): string {
    return `${this.id}${this._renderShape(this.toString(), Shape.PARALLEOGRAM_ALT)}`;
  }

  public override get includeInDependencyGraph(): boolean {
    return false;
  }

  public override toString(): string {
    let result = this.variableName;

    if (this.initializer) {
      result += ` = ${this.initializer.toString()}`;
    }
    return result;
  }
}
