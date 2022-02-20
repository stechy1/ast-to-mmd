import { GraphBlock, GraphBlockType } from './graph-block';
import { LINE_HEAD, LineRenderer } from './render/line-renderer';
import { Shape } from './render';

export class IfElseDeclarationGraphBlock extends GraphBlock {
  constructor(
    id: string,
    private readonly condition: string,
    private readonly thanBlock: GraphBlock,
    private readonly elseBlock?: GraphBlock
  ) {
    super(id, GraphBlockType.IF_ELSE_STATEMENT);
  }

  public override render(indent: number): string {
    return `
${this.generateSpace(indent)}${this.id}${this.renderShape(this.condition, Shape.RHOMBUS)}
${this.thanBlock.render(indent)}
${this.elseBlock?.render(indent)}
${this.renderDependencies(indent)}
`;
  }

  public override get lastId(): string[] {
    const thanBockId = this.thanBlock.lastId;
    const elseBlockId = this.elseBlock?.lastId || [];
    return [...thanBockId, ...elseBlockId];
  }

  protected renderDependencies(indent: number): string {
    let dependencies = this.renderLine(indent, this.id, this.thanBlock.firstId, this.positiveBuilderModifier);
    if (this.elseBlock) {
      dependencies += '\n';
      dependencies += this.renderLine(indent, this.id, this.elseBlock.firstId, this.negativeBuilderModifier);
    }

    return dependencies;
  }

  protected positiveBuilderModifier(builder: LineRenderer): LineRenderer {
    return builder.setConnectionDescription('Yes');
  }

  protected negativeBuilderModifier(builder: LineRenderer): LineRenderer {
    return builder.setConnectionDescription('No');
  }

  protected override createLineBuilder(lhsId: string, rhsId: string): LineRenderer {
    return super.createLineBuilder(lhsId, rhsId).setRhsHead(LINE_HEAD.ARROW);
  }
}
