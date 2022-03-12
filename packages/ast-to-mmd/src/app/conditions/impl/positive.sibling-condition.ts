import { GraphBlock } from '../../graph-blocks';
import { SiblingCondition } from '../sibling.condition';

/**
 * Positive implementation of {@link SiblingCondition}.
 * The condition is always met.
 */
export class PositiveSiblingCondition implements SiblingCondition {

  public isValid(_sibling: GraphBlock): boolean {
    return true;
  }

}
