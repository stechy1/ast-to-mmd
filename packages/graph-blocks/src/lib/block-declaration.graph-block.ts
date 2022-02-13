import { GraphBlock, GraphBlockType } from './graph-block';
import { LINE_HEAD, LineBuilder } from './render/line-renderer';

export class BlockDeclarationGraphBlock extends GraphBlock {
  constructor(private readonly childBlocks: GraphBlock[]) {
    super(GraphBlockType.BLOCK_DECLARATION);
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
    if (this.childBlocks.length === 1) {
      return '';
    }

    return this.childBlocks.reduce((prev, curr, a) => {
      return prev ? this.renderLine(indent + 1, prev, curr.id) : curr.id;
    }, '');
  }

  protected override createLineBuilder(
    lhsId: string,
    rhsId: string
  ): LineBuilder {
    return super.createLineBuilder(lhsId, rhsId).setRhsHead(LINE_HEAD.ARROW);
  }
}
