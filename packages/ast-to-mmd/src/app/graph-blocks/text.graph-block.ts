import { GraphBlock } from './graph-block';

export class TextGraphBlock extends GraphBlock {
  constructor(id: string, private readonly graphBlock: GraphBlock | string) {
    super(id);
  }

  render(_indent: number): string {
    return this.graphBlock.toString();
  }

  override get firstBlock(): GraphBlock {
    return this.blockIsString ? super.firstBlock : (<GraphBlock>this.graphBlock).firstBlock;
  }

  override get lastBlocks(): string[] {
    return this.blockIsString ? super.lastBlocks : (<GraphBlock>this.graphBlock).lastBlocks;
  }

  override toString(): string {
    return this.graphBlock.toString();
  }

  protected get blockIsString() {
    return typeof this.graphBlock === 'string';
  }
}
