/**
 * Interface describing method for {@link GraphBlock} ID generator
 */
export interface BlockIdGenerator {
  /**
   * Generates ID
   *
   * @returns unique ID
   */
  generate(): string;
}
