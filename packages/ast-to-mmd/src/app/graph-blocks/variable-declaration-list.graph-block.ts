import { GraphBlock } from './graph-block';
import { VariableDeclarationGraphBlock } from './variable-declaration.graph-block';

export class VariableDeclarationListGraphBlock extends GraphBlock {
  constructor(id: string, private readonly variableDeclarations: VariableDeclarationGraphBlock[]) {
    super(id);
  }

  public override render(_indent: number): string {
    return '';
  }

  public override get includeInDependencyGraph(): boolean {
    return false;
  }

  public override toString(): string {
    return this.variableDeclarations
      .map((value: VariableDeclarationGraphBlock) => value.toString())
      .join(', ');
  }
}
