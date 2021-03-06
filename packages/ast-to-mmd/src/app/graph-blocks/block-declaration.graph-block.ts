import { BlockKind } from '../block.kind';
import { NotEmptyBlockSiblingCondition } from '../conditions';
import { GraphBlock } from './graph-block';
import { LINE_HEAD, LineRenderer } from './renderer';

export class BlockDeclarationGraphBlock extends GraphBlock {
  constructor(id: string, protected readonly childBlocks: GraphBlock[]) {
    super(id);
    this.siblingCondition = new NotEmptyBlockSiblingCondition();
    this._assignParent(childBlocks);
  }

  public render(_indent: number): string {
    return `
${this.renderChildren(_indent, this.childBlocks)}
${this.renderDependencies(_indent)}
`;
  }

  public override get blockKind(): BlockKind {
    return BlockKind.BLOCK_DECLARATION;
  }

  public override get firstBlock(): GraphBlock {
    return this.childBlocks[0];
  }

  public override get lastBlocks(): string[] {
    if (this.childBlocks.length === 0) {
      return super.lastBlocks;
    }
    if (this.childBlocks.length === 1) {
      return this.childBlocks[0].includeInDependencyGraph && !this.childBlocks[0].skipRenderRestDependencies ? this.childBlocks[0].lastBlocks : [];
    }

    const visibleBlocks = this.blocksWithDependencies;
    if (visibleBlocks.length === 0) {
      return [];
    }

    return visibleBlocks[visibleBlocks.length - 1].lastBlocks;
  }

  public override get hasChildren(): boolean {
    return this.blocksWithDependencies.length !== 0;
  }

  public override get children(): GraphBlock[][] {
    if (this.childBlocks.length === 0) {
      return super.children;
    }

    return [this.childBlocks];
  }

  protected get blocksWithDependencies(): GraphBlock[] {
    return this._filterChildren(this.childBlocks);
  }

  protected renderDependencies(_indent: number): string {
    return this._renderDependencies(_indent, this.childBlocks);
  }

  protected renderChildren(indent: number, children: GraphBlock[]): string {
    return this._filterChildren(children)
      .filter((child: GraphBlock) => !child.isDependencyBridge)
      .map((child: GraphBlock) => `${child.render(indent + 1)}\n${child.renderLazyDependencies(indent + 1)}`)
      .join('\n');
  }

  protected override createLineBuilder(lhsId: string, rhsId: string): LineRenderer {
    return super.createLineBuilder(lhsId, rhsId).setRhsHead(LINE_HEAD.ARROW);
  }
}
