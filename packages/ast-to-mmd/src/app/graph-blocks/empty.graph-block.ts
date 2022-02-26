import { GraphBlock } from './graph-block';

export class EmptyGraphBlock extends GraphBlock {
  constructor(id: string) {
    super(id);
  }

  render(_indent: number): string {
    return '';
  }

  public override get includeInDependencyGraph(): boolean {
    return false;
  }
}
