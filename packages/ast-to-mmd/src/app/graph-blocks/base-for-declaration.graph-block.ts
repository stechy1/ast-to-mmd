import { BlockDeclarationGraphBlock } from './block-declaration.graph-block';
import { GraphBlock } from './graph-block';
import { LINE_HEAD, LINE_STYLE, LineRenderer, Shape } from './renderer';

export abstract class BaseForDeclarationGraphBlock extends BlockDeclarationGraphBlock {
  private static CYCLE_COUNTER = 0;

  private cycleID = BaseForDeclarationGraphBlock.CYCLE_COUNTER++;

  protected constructor(id: string, protected readonly body: GraphBlock[]) {
    super(id, body);
  }

  public override render(_indent: number): string {
    return this.renderInSubgraph(
      _indent,
      `${this.id}_${this.cycleID}`,
      `CYCLE_${this.cycleID}`,
      (bodyIndent) => this.renderOuterBody(bodyIndent)
    );
  }

  protected renderOuterBody(indent: number): string {
    return `
${this._generateSpace(indent + 1)}${this.id}${this._renderShape(this.renderCondition(), Shape.PARALLEOGRAM)}
${super.render(indent)}
`;
  }

  protected override renderDependencies(_indent: number): string {
    const blocksToRender = this.blocksWithDependencies;
    let childDependencies = '';
    if (blocksToRender.length !== 0) {
      childDependencies = this._renderLinesL2R(
        _indent,
        this.id,
        blocksToRender[blocksToRender.length - 1].lastBlocks,
        (builder) => this.createLoopLine(builder)
      );
    }
    return `
${this._renderLine(_indent, this.id, this.body[0].firstBlock.id)}
${childDependencies}
${super.renderDependencies(_indent)}
`;
  }

  protected abstract renderCondition(): string;

  protected renderBody(indent: number): string {
    return super.renderDependencies(indent);
  }

  protected override createLineBuilder(lhsId: string, rhsId: string): LineRenderer {
    return super.createLineBuilder(lhsId, rhsId).setRhsHead(LINE_HEAD.ARROW);
  }

  protected createLoopLine(builder: LineRenderer): LineRenderer {
    return builder.setConnectionDescription(`loop_${this.cycleID}`).setLineStyle(LINE_STYLE.DOTTED);
  }
}
