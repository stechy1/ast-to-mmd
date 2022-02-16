import { BlockIdGenerator } from './block-id-generator';

export class IncrementalBlockIdGenerator implements BlockIdGenerator {

  private counter = 0;

  generate(): string {
    return `${this.counter++}`;
  }

}
