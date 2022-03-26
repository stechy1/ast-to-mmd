import { BlockKind } from '../block.kind';
import { BlockDeclarationGraphBlock } from './block-declaration.graph-block';
import { CaseDeclarationGraphBlock } from './case-declaration.graph-block';
import { GraphBlock } from './graph-block';
import { LineRendererModifier, Shape } from './renderer';

export class SwitchDeclarationGraphBlock extends BlockDeclarationGraphBlock {

  constructor(id: string, blockCases: CaseDeclarationGraphBlock[], private readonly condition: string, private readonly defaultClauseExists: boolean) {
    super(id, blockCases);
  }

  public override get blockKind(): BlockKind {
    return BlockKind.SWITCH_DECLARATION;
  }

  override get firstBlock(): GraphBlock {
    return this;
  }


  public override get lastBlocks(): string[] {
    return this.childBlocks.map(child => child.lastBlocks).reduce((prev: string[], curr: string[]) => [...prev, ...curr], [])
  }

  public override render(_indent: number): string {
    return `
${this._generateSpace(_indent + 1)}${this.id}${this._renderShape(`SWITCH <br> ${this.condition}`, Shape.RHOMBUS)}
${super.render(_indent)}
${this.renderDirectDependencies(_indent + 1)}
`;
  }

  protected renderDirectDependencies(_indent: number): string {
    const directDependencies = this.childBlocks.map(child =>
      this._renderLine(_indent, this.id, child.firstBlock.id, this.__buildLineModifier(child as CaseDeclarationGraphBlock))
    ).join('\n');

    if (!this.defaultClauseExists) {
      const sibling: GraphBlock | undefined = this._findSiblingChild(this);
      if (sibling) {
        this.lazyDependency = this._renderLine(0, this.id, sibling.id, builder => builder.setConnectionDescription('default'))
      }
    }

    return directDependencies;
  }

  private __buildLineModifier(child: CaseDeclarationGraphBlock): LineRendererModifier {
    return builder => builder.setConnectionDescription(child.condition);
  }
}

export type CaseMap = { condition: string, block: GraphBlock };
