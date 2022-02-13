import { GraphBlock, GraphBlockType } from './graph-block';

export class EmptyGraphBlock extends GraphBlock {
  constructor() {
    super(GraphBlockType.EMPTY_STATEMENT);
  }

  render(indent: number): string {
    return '';
  }
}
