import { GraphBlock } from './graph-block';
import { BlockDeclarationGraphBlock } from './block-declaration.graph-block';

export class GraphParentGraphBlock extends BlockDeclarationGraphBlock {
  constructor(id: string, ...childBlocks: GraphBlock[]) {
    super(id, childBlocks);
  }

  public override render(indent: number): string {
    return `
flowchart TD
${this.generateSpace(indent)}${super.render(indent)}`;
  }
}
