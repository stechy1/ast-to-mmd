import { LineBuilder } from './render/line-renderer';

export enum GraphBlockType {
  EMPTY_STATEMENT,
  PARENT_CONTAINER,
  BLOCK_DECLARATION,
  VARIABLE_DECLARATION,
  METHOD_CALL,
  IF_ELSE_STATEMENT,
  FOR_STATEMENT,
  TRY_CATCH_STATEMENT,
  THROW_STATEMENT,
}

export abstract class GraphBlock {
  protected constructor(
    public readonly id: string,
    public readonly type: GraphBlockType
  ) {}

  public abstract render(indent: number): string;

  public get firstId(): string {
    return this.id;
  }

  public get lastId(): string[] {
    return [this.id];
  }

  protected generateSpace(count: number): string {
    return ' '.repeat(count);
  }

  protected renderLine(
    indent: number,
    lhsId: string,
    rhsId: string,
    builderModifier?: (builder: LineBuilder) => LineBuilder
  ): string {
    let builder = this.createLineBuilder(lhsId, rhsId);
    if (builderModifier) {
      builder = builderModifier(builder);
    }

    return `${this.generateSpace(indent + 1)}${builder.build()}`;
  }

  protected createLineBuilder(lhsId: string, rhsId: string): LineBuilder {
    return new LineBuilder(lhsId, rhsId);
  }

  public includeInDependencyGraph(): boolean {
    return true;
  }
}
