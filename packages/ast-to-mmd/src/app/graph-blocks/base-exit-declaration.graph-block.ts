import { GraphBlock } from './graph-block';

export abstract class BaseExitDeclarationGraphBlock extends GraphBlock {
  protected constructor(id: string) {
    super(id);
  }


  override get skipRenderRestDependencies(): boolean {
    return true;
  }
}
