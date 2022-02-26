import { BlockDeclarationGraphBlock } from './block-declaration.graph-block';
import { GraphBlock } from './graph-block';

export class GraphParentGraphBlock extends BlockDeclarationGraphBlock {
  constructor(id: string, ...childBlocks: GraphBlock[]) {
    super(id, childBlocks);
  }

  public override render(_indent: number): string {
    return `
flowchart TD
${this._generateSpace(_indent)}${super.render(_indent)}
`;
  }
}
