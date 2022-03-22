import { BlockKind } from '../../block.kind';
import { GraphBlock } from '../../graph-blocks';
import { SiblingCondition } from '../sibling.condition';

export class NotEmptyBlockSiblingCondition  implements SiblingCondition {

  public isValid(sibling: GraphBlock): boolean {
    return sibling.blockKind !== BlockKind.EMPTY_DECLARATION;
  }

}
