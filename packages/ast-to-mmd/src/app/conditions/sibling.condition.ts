import { GraphBlock } from '../graph-blocks';

/**
 * Interface representing condition for resolving siblings of defined child;
 */
export interface SiblingCondition {

  /**
   * Based on used condition is checked whether the tested sibling is valid or not.
   *
   * @param sibling {@link GraphBlock} Tested sibling.
   */
  isValid(sibling: GraphBlock): boolean;

}
