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

  public override get firstId(): string {
    return this.childBlocks[0].id;
  }

  public override get lastId(): string[] {
    return [this.childBlocks[this.childBlocks.length - 1].id];
  }

  protected renderDependencies(indent: number): string {
    const blocksWithDependencies = this.childBlocks.filter(
      (block: GraphBlock) => block.includeInDependencyGraph()
    );
    if (blocksWithDependencies.length === 1) {
      return '';
    }

    let result = '';
    let lastBlockWithDependency = blocksWithDependencies[0];

    for (let i = 1; i < blocksWithDependencies.length; i++) {
      const currentBlockWithDependency = blocksWithDependencies[i];
      const currentFirstId = currentBlockWithDependency.firstId;
      const lastIds = lastBlockWithDependency.lastId;

      result += lastIds
        .map((id) => {
          return this.renderLine(indent + 1, id, currentFirstId);
        })
        .join('\n');
      result += '\n';

      lastBlockWithDependency = currentBlockWithDependency;
    }

    return result;
  }

  protected override createLineBuilder(
    lhsId: string,
    rhsId: string
  ): LineBuilder {
    return super.createLineBuilder(lhsId, rhsId).setRhsHead(LINE_HEAD.ARROW);
  }
}
