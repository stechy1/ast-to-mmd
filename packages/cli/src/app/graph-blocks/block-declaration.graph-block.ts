import { GraphBlock, GraphBlockType } from './graph-block';
import { LINE_HEAD, LineBuilder } from './render/line-renderer';

export class BlockDeclarationGraphBlock extends GraphBlock {
  constructor(id: string, protected readonly childBlocks: GraphBlock[]) {
    super(id, GraphBlockType.BLOCK_DECLARATION);
  }

  public render(indent: number): string {
    return `
${this.childBlocks.map((child) => child.render(indent + 1)).join('\n')}
${this.renderDependencies(indent)}`;
  }

  public override getFirstId(): string {
    return this.childBlocks[0].id;
  }

  public override getLastId(): string {
    return this.childBlocks[this.childBlocks.length - 1].id;
  }

  protected renderDependencies(indent: number): string {
    const blocksWithDependencies = this.childBlocks.filter((block: GraphBlock) => block.includeInDependencyGraph());
    if (blocksWithDependencies.length === 1) {
      return '';
    }

    return blocksWithDependencies.reduce((prev, curr) => {
      return prev ? this.renderLine(indent + 1, prev, curr.id) : curr.id;
    }, '');
  }

  protected override createLineBuilder(lhsId: string, rhsId: string): LineBuilder {
    return super.createLineBuilder(lhsId, rhsId).setRhsHead(LINE_HEAD.ARROW);
  }
}
