import { GraphBlock, GraphBlockType } from './graph-block';
import { Shape } from './render';

export class TryCatchDeclarationGraphBlock extends GraphBlock {
  constructor(id: string, private readonly tryBlock: GraphBlock, private readonly catchBlock?: GraphBlock) {
    super(id, GraphBlockType.TRY_CATCH_STATEMENT);
  }

  public override render(indent: number): string {
    return `
${this.generateSpace(indent)}subgraph ${this.id} ${this.renderShape('TRY-CATCH', Shape.SHARP_EDGES)}
${this.generateSpace(indent + 1)}direction TB

${this.generateSpace(indent + 1)}subgraph ${this.tryBlock.id} ${this.renderShape('TRY', Shape.SHARP_EDGES)}
${this.generateSpace(indent + 2)}direction TB
${this.tryBlock.render(indent + 2)}
${this.generateSpace(indent + 1)}end

${this.generateSpace(indent + 1)}subgraph ${this.catchBlock?.id} ${this.renderShape(
      'CATCH',
      Shape.SHARP_EDGES
    )}
${this.generateSpace(indent + 2)}direction TB
${this.catchBlock?.render(indent + 2)}
${this.generateSpace(indent + 1)}end
${this.generateSpace(indent)}end`;
  }

  public override get firstId(): string {
    return this.tryBlock.firstId;
  }

  public override get lastId(): string[] {
    return super.lastId;
  }
}
