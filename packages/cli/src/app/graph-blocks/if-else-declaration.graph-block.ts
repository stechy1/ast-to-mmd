import { GraphBlock, GraphBlockType } from './graph-block';
import { LINE_HEAD, LineBuilder } from './render/line-renderer';

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
${this.generateSpace(indent)}${this.id}{${this.condition}}
${this.thanBlock.render(indent)}
${this.elseBlock?.render(indent)}
${this.renderDependencies(indent)}
`;
  }

  protected renderDependencies(indent: number): string {
    let dependencies = this.renderLine(indent, this.id, this.thanBlock.getFirstId(), this.positiveBuilderModifier)
    if (this.elseBlock) {
      dependencies += '\n';
      dependencies += this.renderLine(indent, this.id, this.elseBlock.getFirstId(), this.negativeBuilderModifier)
    }

    return dependencies;
  }

  protected positiveBuilderModifier(builder: LineBuilder): LineBuilder {
    return builder.setConnectionDescription("Yes");
  }

  protected negativeBuilderModifier(builder: LineBuilder): LineBuilder {
    return builder.setConnectionDescription("No");
  }

  protected override createLineBuilder(lhsId: string, rhsId: string): LineBuilder {
    return super.createLineBuilder(lhsId, rhsId).setRhsHead(LINE_HEAD.ARROW);
  }
}
