/**
 * Base class representing constraint.
 */
export abstract class Constraint {

  /**
   * Test whether the value is in {@link Constraint}.
   *
   * @param value {string} Tested value.
   * @returns True, when the value is in {@link Constraint}, False otherwise.
   */
  public abstract inConstraint(value: string): boolean;

}
