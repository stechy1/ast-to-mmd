import { BlockKind } from '../block.kind';
import { BlockDeclarationGraphBlock } from './block-declaration.graph-block';
import { GraphBlock } from './graph-block';

export class TryCatchDeclarationGraphBlock extends BlockDeclarationGraphBlock {
  private static TRY_CATCH_COUNTER = 0;
  private static TRY_COUNTER = 0;
  private static CATCH_COUNTER = 0;
  private static FINALLY_COUNTER = 0;

  private tryCatchId = TryCatchDeclarationGraphBlock.TRY_CATCH_COUNTER++;
  private tryId = TryCatchDeclarationGraphBlock.TRY_COUNTER++;
  private catchId = TryCatchDeclarationGraphBlock.CATCH_COUNTER++;
  private finallyId = TryCatchDeclarationGraphBlock.FINALLY_COUNTER++;

  constructor(
    id: string,
    private readonly tryBlock?: GraphBlock[],
    private readonly catchBlock?: GraphBlock[],
    private readonly finallyBlock?: GraphBlock[],
    private readonly catchBlockId?: string,
    private readonly finallyBlockId?: string
  ) {
    super(id, tryBlock || []);
    this._assignParent(catchBlock || []);
    this._assignParent(finallyBlock || []);
  }

  public override render(_indent: number): string {
    return this.renderInSubgraph(_indent, this.id, `TRY-CATCH_${this.tryCatchId}`, (bodyIndent: number) =>
      this.renderOuterBody(bodyIndent)
    );
  }

  public override get blockKind(): BlockKind {
    return BlockKind.TRY_CATCH_DECLARATION;
  }

  override get children(): GraphBlock[][] {
    const tryChildren = super.children;
    const catchChildren = this.catchBlock || [];
    const finallyChildren = this.finallyBlock || [];

    return [...tryChildren, catchChildren, finallyChildren];
  }

  protected renderOuterBody(indent: number): string {
    return `
${
  this.tryBlock
    ? this.renderInSubgraph(indent, `TRY_${this.tryCatchId}`, `TRY_${this.tryId}`, (bodyIndent) =>
        this.renderTryBody(bodyIndent)
      )
    : ''
}
${
  this.catchBlock
    ? this.renderInSubgraph(indent, `CATCH_${this.catchBlockId}`, `CATCH_${this.catchId}`, (bodyIndent) =>
        this.renderCatchBody(bodyIndent)
      )
    : ''
}
${
  this.finallyBlock
    ? this.renderInSubgraph(
        indent,
        `FINALLY_${this.finallyBlockId}`,
        `FINALLY_${this.finallyId}`,
        (bodyIndent) => this.renderFinallyBody(bodyIndent)
      )
    : ''
}
${this.renderDependencies(indent)}
`;
  }

  protected renderTryBody(indent: number): string {
    return `
${this.tryBlock ? this.renderChildren(indent, this.tryBlock) : ''}
${this.tryBlock ? this._renderDependencies(indent, this.tryBlock) : ''}
`;
  }

  protected renderCatchBody(indent: number): string {
    return `
${this.catchBlock ? this.renderChildren(indent, this.catchBlock) : ''}
${this.catchBlock ? this._renderDependencies(indent, this.catchBlock) : ''}
`;
  }

  protected renderFinallyBody(indent: number): string {
    return `
${this.finallyBlock ? this.renderChildren(indent, this.finallyBlock) : ''}
${this.finallyBlock ? this._renderDependencies(indent, this.finallyBlock) : ''}
`;
  }

  /**
   * Render dependencies between internal blocks: TRY - CATCH - FINALLY
   *
   * @param _indent
   */
  protected override renderDependencies(_indent: number): string {
    let result = '';
    if (this.finallyBlock) {
      const filteredFinalyBlock = this._filterChildren(this.finallyBlock);
      if (filteredFinalyBlock) {
        if (this.tryBlock) {
          const filteredTryBlock = this._filterChildren(this.tryBlock);
          if (filteredTryBlock.length !== 0) {
            result += this._renderLinesL2R(
              _indent,
              `${filteredFinalyBlock[0].firstBlock.id}`,
              filteredTryBlock[filteredTryBlock.length - 1].lastBlocks
            );
          }
        }
        if (this.catchBlock) {
          const filteredCatchBlock = this._filterChildren(this.catchBlock);
          if (filteredCatchBlock.length !== 0) {
            result += this._renderLinesL2R(
              _indent,
              `${filteredFinalyBlock[0].firstBlock.id}`,
              filteredCatchBlock[filteredCatchBlock.length - 1].lastBlocks
            );
          }
        }
      }
    }

    return result;
  }

  public override get lastBlocks(): string[] {
    if (this.finallyBlock) {
      return this.finallyBlock[this.finallyBlock.length - 1].lastBlocks;
    }

    const tryBlockLastId = super.lastBlocks;
    const catchLastId: string[] = this.catchBlock
      ? this.catchBlock[this.catchBlock.length - 1].lastBlocks
      : [];

    const allIds = [...tryBlockLastId, ...catchLastId];
    if (allIds.length === 0) {
      allIds.push(this.id);
    }

    return allIds;
  }
}
