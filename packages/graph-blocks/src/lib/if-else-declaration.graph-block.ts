import { GraphBlock, GraphBlockType } from './graph-block';

export class IfElseDeclarationGraphBlock extends GraphBlock {
  constructor(
    private readonly condition: string,
    private readonly thanBlock: GraphBlock,
    private readonly elseBlock?: GraphBlock
  ) {
    super(GraphBlockType.IF_ELSE_STATEMENT);
  }

  public override render(indent: number): string {
    return `
${this.generateSpace(indent)}${this.id}{${this.condition}}
${this.thanBlock.render(indent)}
${this.elseBlock?.render(indent)}
${this.renderDependencies(indent)}
`;
  }

  protected renderDependencies(indent: number): string {
    const dependencies = '';

    return dependencies;

    //   return this.childBlocks.reduce((prev, curr, a) => {
    //     return prev ? `${this.generateSpace(indent + 1)}${prev} --> ${curr.id}` : curr.id;}, '');
  }
}
