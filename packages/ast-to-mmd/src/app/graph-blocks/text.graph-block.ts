import { GraphBlock } from './graph-block';

export class TextGraphBlock extends GraphBlock {
  constructor(id: string, private readonly graphBlock: GraphBlock | string) {
    super(id);
  }

  render(_indent: number): string {
    return this.graphBlock.toString();
  }

  override get firstId(): string {
    return this.blockIsString ? super.firstId : (<GraphBlock>this.graphBlock).firstId;
  }

  override get lastId(): string[] {
    return this.blockIsString ? super.lastId : (<GraphBlock>this.graphBlock).lastId;
  }

  override toString(): string {
    return this.graphBlock.toString();
  }

  protected get blockIsString() {
    return typeof this.graphBlock === 'string';
  }
}
