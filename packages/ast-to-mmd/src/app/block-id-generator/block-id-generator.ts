/**
 * Interface describing method for {@link GraphBlock} ID generator
 */
export interface BlockIdGenerator {
  /**
   * Generates ID.
   *
   * @returns {string} Unique ID.
   */
  generate(): string;
}
