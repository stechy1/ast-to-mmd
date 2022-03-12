import { BlockKind } from '../block.kind';
import { BaseExitDeclarationGraphBlock } from './base-exit-declaration.graph-block';
import { Shape } from './renderer';

export class ReturnDeclarationGraphBlock extends BaseExitDeclarationGraphBlock {
  constructor(id: string) {
    super(id);
  }

  render(_indent: number): string {
    return `${this._generateSpace(_indent)}${this.id}${this._renderShape('return', Shape.CIRCLE)}`;
  }

  public override get blockKind(): BlockKind {
    return BlockKind.RETURN_DECLARATION;
  }

}
