import { BlockKind } from '../../block.kind';
import { GraphBlock } from '../../graph-blocks';
import { SiblingCondition } from '../sibling.condition';

/**
 * Implementation of {@link SiblingCondition} which checks {@link BlockKind}.
 */
export class OfKindSiblingCondition implements SiblingCondition {

  private readonly _blockKinds: BlockKind[];

  constructor(...blockKinds: BlockKind[]) {
    this._blockKinds = blockKinds;
  }

  isValid(sibling: GraphBlock): boolean {
    return this._blockKinds.some((block: BlockKind) => block === sibling.blockKind);
  }

}
