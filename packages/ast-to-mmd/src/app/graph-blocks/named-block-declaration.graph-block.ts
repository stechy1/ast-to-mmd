import { BlockKind } from '../block.kind';
import { BlockDeclarationGraphBlock } from './block-declaration.graph-block';
import { GraphBlock } from './graph-block';

export class NamedBlockDeclarationGraphBlock extends BlockDeclarationGraphBlock {
  constructor(id: string, childBlocks: GraphBlock[], private readonly name: string) {
    super(id, childBlocks);
  }

  public override get blockKind(): BlockKind {
    return BlockKind.NAMED_BLOCK_DECLARATION;
  }

  override get includeInDependencyGraph(): boolean {
    return this.childBlocks.length !== 0;
  }

  override render(_indent: number): string {
    return this.renderInSubgraph(_indent, this.id, this.name, (bodyIndent: number) => this.renderOuterBody(bodyIndent))
  }

  protected renderOuterBody(indent: number): string {
    return super.render(indent);
  }
}
