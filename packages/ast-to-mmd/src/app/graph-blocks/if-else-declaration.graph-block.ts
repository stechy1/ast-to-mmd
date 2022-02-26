import { BlockDeclarationGraphBlock } from './block-declaration.graph-block';
import { GraphBlock } from './graph-block';
import { LINE_HEAD, LineRenderer, Shape } from './renderer';

export class IfElseDeclarationGraphBlock extends BlockDeclarationGraphBlock {
  private static CONDITION_COUNTER = 0;

  private conditionID = IfElseDeclarationGraphBlock.CONDITION_COUNTER++;

  constructor(
    id: string,
    private readonly condition: string,
    private readonly thanBlock: GraphBlock[],
    private readonly elseBlock?: GraphBlock[]
  ) {
    super(id, thanBlock);
    this._assignParent(elseBlock || []);
  }

  public override render(_indent: number): string {
    return this.renderInSubgraph(
      _indent,
      `${this.id}_${this.conditionID}`,
      `CONDITION_${this.conditionID}`,
      (bodyIndent) => this.renderOuterBody(bodyIndent)
    );
  }

  public override get firstId(): string {
    return this.id;
  }

  public override get lastId(): string[] {
    const thanBlockId = super.lastId;
    const visibleElseBlocks = this.elseBlock ? this.filterChildren(this.elseBlock) : [];
    let elseBlockId: string[];
    if (visibleElseBlocks.length === 0) {
      elseBlockId = [];
    } else {
      elseBlockId = visibleElseBlocks[visibleElseBlocks.length - 1].lastId;
    }
    return [...thanBlockId, ...elseBlockId];
  }

  public override get hasChildren(): boolean {
    return this.thanBlock.length !== 0;
  }

  public override get children(): GraphBlock[][] {
    const filteredThanBlock = this.filterChildren(this.thanBlock);
    const filteredElseBlock = this.elseBlock ? this.filterChildren(this.elseBlock) : [];
    const result: GraphBlock[][] = [];

    if (filteredThanBlock.length !== 0) {
      result.push(...filteredThanBlock[filteredThanBlock.length - 1].children);
    }

    if (filteredElseBlock.length !== 0) {
      result.push(...filteredElseBlock[filteredElseBlock.length - 1].children);
    }

    return result;
  }

  protected renderOuterBody(indent: number): string {
    return `
${this._generateSpace(indent + 1)}${this.id}${this._renderShape(this.condition, Shape.RHOMBUS)}
${this.renderChildren(indent, this.thanBlock)}
${this.renderChildren(indent, this.elseBlock || [])}
${this.renderDependencies(indent)}
${this.renderDirectDependencies(indent + 1)}
`;
  }

  protected renderDirectDependencies(indent: number): string {
    let dependencies = '';
    const filteredThanBlock = this.filterChildren(this.thanBlock);
    if (filteredThanBlock.length !== 0) {
      dependencies += this._renderLine(
        indent,
        this.id,
        filteredThanBlock[0].firstId,
        this.positiveBuilderModifier
      );
      dependencies += '\n';
    }
    if (this.elseBlock) {
      const filteredElseBlock = this.filterChildren(this.elseBlock);
      if (filteredElseBlock.length !== 0) {
        dependencies += this._renderLine(
          indent,
          this.id,
          filteredElseBlock[0].firstId,
          this.negativeBuilderModifier
        );
      } else {
        dependencies += this._renderLine(
          indent,
          this.id,
          this.thanBlock[this.thanBlock.length - 1].firstId,
          this.negativeBuilderModifier
        );
      }
    } else {
      if (this.parent) {
        const siblingChild: GraphBlock | undefined = this.findSiblingChild(this);
        if (siblingChild) {
          siblingChild.lazyDependency = this._renderLine(
            0,
            this.id,
            siblingChild.id,
            this.negativeBuilderModifier
          );
        }
      }
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
