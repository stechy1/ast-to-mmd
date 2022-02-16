import { GraphBlock, GraphBlockType } from './graph-block';

export class EmptyGraphBlock extends GraphBlock {
  constructor(id: string) {
    super(id, GraphBlockType.EMPTY_STATEMENT);
  }

  render(indent: number): string {
    return '';
  }

  override includeInDependencyGraph(): boolean {
    return false;
  }
}
