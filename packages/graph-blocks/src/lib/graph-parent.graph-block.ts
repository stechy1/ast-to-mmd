import { GraphBlock } from './graph-block';
import { BlockDeclarationGraphBlock } from './block-declaration.graph-block';

export class GraphParentGraphBlock extends BlockDeclarationGraphBlock {
  constructor(...childBlock: GraphBlock[]) {
    super(childBlock);
  }

  public override render(indent: number): string {
    return `
flowchart TD
${this.generateSpace(indent)}${super.render(indent)}`;
  }
}
