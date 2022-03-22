import { BlockKind } from '../block.kind';
import { BlockDeclarationGraphBlock } from './block-declaration.graph-block';
import { GraphBlock } from './graph-block';
import { LineRenderer, LineRendererModifier, Shape } from './renderer';

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

  public override get blockKind(): BlockKind {
    return BlockKind.IF_ELSE_DECLARATION;
  }

  override get firstBlock(): GraphBlock {
    return this;
  }

  public override get lastBlocks(): string[] {
    const thanBlockId = super.lastBlocks;
    const visibleElseBlocks = this.elseBlock ? this._filterChildren(this.elseBlock) : [];
    let elseBlockId: string[];
    if (visibleElseBlocks.length === 0) {
      elseBlockId = [];
    } else {
      elseBlockId = visibleElseBlocks[visibleElseBlocks.length - 1].lastBlocks;
    }
    return [...thanBlockId, ...elseBlockId];
  }

  public override get hasChildren(): boolean {
    return this.thanBlock.length !== 0;
  }

  public override get children(): GraphBlock[][] {
    const filteredThanBlock = this._filterChildren(this.thanBlock);
    const filteredElseBlock = this.elseBlock ? this._filterChildren(this.elseBlock) : [];
    const result: GraphBlock[][] = [];

    /**
     * Local helper function for unified pushing direct children into a result
     *
     * @param child {@link GraphBlock}
     * @param result {@link GraphBlock[][]}
     */
    function pushDirectChildren(child: GraphBlock, result: GraphBlock[][]): void {
      const indirectChildren = child.children;
      if (indirectChildren.length !== 0 && child.allowUnwrapChildren) {
        result.push(...indirectChildren);
      } else {
        result.push([child]);
      }
    }

    if (filteredThanBlock.length !== 0) {
      const lastDirectChild = filteredThanBlock[filteredThanBlock.length - 1];
      pushDirectChildren(lastDirectChild, result);
    }

    if (filteredElseBlock.length !== 0) {
      const lastDirectChild = filteredElseBlock[filteredElseBlock.length - 1];
      pushDirectChildren(lastDirectChild, result);
    }

    return result;
  }

  override get allowUnwrapChildren(): boolean {
    return false;
  }

  protected renderOuterBody(indent: number): string {
    return `
${this._generateSpace(indent + 1)}${this.id}${this._renderShape(this.condition, Shape.RHOMBUS)}
${this.renderChildren(indent, this.thanBlock)}
${this.renderChildren(indent, this.elseBlock || [])}
${this.renderDependencies(indent)}
${this._renderDependencies(indent, this.elseBlock || [])}
${this.renderDirectDependencies(indent + 1)}
`;
  }

  protected renderDirectDependencies(indent: number): string {
    let dependencies = '';
    const filteredThanBlock = this._filterChildren(this.thanBlock);
    if (filteredThanBlock.length !== 0) {
      const firstChild: GraphBlock = filteredThanBlock[0];
      dependencies += this.__renderDirectDependencies(indent, firstChild, this.positiveBuilderModifier);

      dependencies += '\n';
    }
    if (this.elseBlock) {
      const filteredElseBlock = this._filterChildren(this.elseBlock);
      if (filteredElseBlock.length !== 0) {
        const firstChild: GraphBlock = filteredElseBlock[0];
        dependencies += this.__renderDirectDependencies(indent, firstChild, this.negativeBuilderModifier);
      } else {
        const lastChild: GraphBlock = filteredElseBlock[filteredElseBlock.length - 1];
        dependencies += this.__renderDirectDependencies(indent, lastChild, this.negativeBuilderModifier);
      }
    } else {
      if (this.parent) {
        const siblingChild: GraphBlock | undefined = this._findSiblingChild(this);
        if (siblingChild) {
          siblingChild.lazyDependency = this._renderLine(0, this.id, siblingChild.id, this.negativeBuilderModifier);
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

  private __renderDirectDependencies(indent: number, children: GraphBlock, builderModifier: LineRendererModifier): string {
    let dependencies = '';
    if (!children.isDependencyBridge) {
      dependencies += this._renderLine(indent, this.id, children.firstBlock.id, builderModifier);
    }
    if (children.skipRenderRestDependencies) {
      dependencies += this._renderConnectionWithParent(indent, children, [this.id], builderModifier);
    }

    return dependencies;
  }

}
