import { randomUUID } from 'crypto';

import { BlockIdGenerator } from './block-id-generator';

export class UuidBlockIdGenerator implements BlockIdGenerator {

  generate(): string {
    return randomUUID().replace(/-/g, '_');
  }

}
