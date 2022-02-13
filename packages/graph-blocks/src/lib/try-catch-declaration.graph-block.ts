import { GraphBlock, GraphBlockType } from './graph-block';

export class TryCatchDeclarationGraphBlock extends GraphBlock {
  constructor(
    private readonly tryBlock: GraphBlock,
    private readonly catchBlock?: GraphBlock
  ) {
    super(GraphBlockType.TRY_CATCH_STATEMENT);
  }

  public override render(indent: number): string {
    return `
${this.generateSpace(indent)}subgraph ${this.id} [TRY-CATCH]
${this.generateSpace(indent + 1)}direction TB

${this.generateSpace(indent + 1)}subgraph ${this.tryBlock.id} [TRY]
${this.generateSpace(indent + 2)}direction TB
${this.tryBlock.render(indent + 2)}
${this.generateSpace(indent + 1)}end

${this.generateSpace(indent + 1)}subgraph ${this.catchBlock?.id} [CATCH]
${this.generateSpace(indent + 2)}direction TB
${this.catchBlock?.render(indent + 2)}
${this.generateSpace(indent + 1)}end
${this.generateSpace(indent)}end`;
  }

  public override getFirstId(): string {
    return this.tryBlock.getFirstId();
  }

  public override getLastId(): string {
    return super.getLastId();
  }
}
