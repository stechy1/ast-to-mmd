import { BlockKind } from '../block.kind';
import { BlockDeclarationGraphBlock } from './block-declaration.graph-block';
import { GraphBlock } from './graph-block';

export class CaseDeclarationGraphBlock extends BlockDeclarationGraphBlock {

  constructor(id: string, children: GraphBlock[], public readonly condition: string) {
    super(id, children);
  }

  public override get blockKind(): BlockKind {
    return BlockKind.CASE_DECLARATION;
  }

  // public override get firstBlock(): GraphBlock {
  //   return this;
  // }

}
