import { BlockDeclarationGraphBlock } from './block-declaration.graph-block';
import { GraphBlock } from './graph-block';
import { Shape } from './render';

export class NamedBlockDeclarationGraphBlock extends BlockDeclarationGraphBlock {
  constructor(id: string, childBlocks: GraphBlock[], private readonly name: string) {
    super(id, childBlocks);
  }

  override render(indent: number): string {
    return `
${this.generateSpace(indent)}subgraph ${this.id} ${this.renderShape(this.name, Shape.SHARP_EDGES)}
${this.generateSpace(indent + 1)}direction TB
${super.render(indent + 1)}
${this.generateSpace(indent)}end`;
  }
}
