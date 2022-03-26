import { BlockKind, CYCLE_BLOCK_KIND } from '../block.kind';
import { OfKindSiblingCondition } from '../conditions';
import { BaseExitDeclarationGraphBlock } from './base-exit-declaration.graph-block';
import { LINE_STYLE, LineRendererModifier } from './renderer';

export class BreakDeclarationGraphBlock extends BaseExitDeclarationGraphBlock {

  public constructor(id: string) {
    super(id);
    this.parentSiblingCondition = new OfKindSiblingCondition(...CYCLE_BLOCK_KIND, BlockKind.SWITCH_DECLARATION);
  }

  public override get blockKind(): BlockKind {
    return BlockKind.BREAK_DECLARATION;
  }

  public override get connectWithNextParentsSibling(): boolean {
    return true;
  }

  public override get isDependencyBridge(): boolean {
    return true;
  }

  public render(_indent: number): string {
    return '';
  }

  override get lineRendererModifier(): LineRendererModifier {
    return builder => builder.setLineStyle(LINE_STYLE.DOTTED).setConnectionDescription('break', true);
  }
}
