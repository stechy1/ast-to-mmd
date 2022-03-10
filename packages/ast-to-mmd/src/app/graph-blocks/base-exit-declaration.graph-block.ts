import { GraphBlock } from './graph-block';

export abstract class BaseExitDeclarationGraphBlock extends GraphBlock {
  protected constructor(id: string) {
    super(id);
  }

  override get lastBlocks(): string[] {
    return [];
  }

  override get skipRenderRestDependencies(): boolean {
    return true;
  }
}
