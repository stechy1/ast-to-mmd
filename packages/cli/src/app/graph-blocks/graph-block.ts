import { LineRenderer, Shape, ShapeRenderer } from './render';

export enum GraphBlockType {
  EMPTY_STATEMENT,
  BLOCK_DECLARATION,
  VARIABLE_DECLARATION,
  METHOD_CALL,
  IF_ELSE_STATEMENT,
  FOR_STATEMENT,
  TRY_CATCH_STATEMENT,
  THROW_STATEMENT,
}

export abstract class GraphBlock {
  private static readonly SHAPE_RENDERER: ShapeRenderer = new ShapeRenderer();

  protected constructor(public readonly id: string, public readonly type: GraphBlockType) {}

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
    builderModifier?: (builder: LineRenderer) => LineRenderer
  ): string {
    let builder = this.createLineBuilder(lhsId, rhsId);
    if (builderModifier) {
      builder = builderModifier(builder);
    }

    return `${this.generateSpace(indent + 1)}${builder.render()}`;
  }

  protected createLineBuilder(lhsId: string, rhsId: string): LineRenderer {
    return new LineRenderer(lhsId, rhsId);
  }

  /**
   * Renders defined shape with text
   *
   * @param text Text in shape
   * @param shape {@link Shape} Type of shape
   * @returns Rendered shape with text
   */
  protected renderShape(text: string, shape: Shape): string {
    return GraphBlock.SHAPE_RENDERER.render(text, shape);
  }

  public includeInDependencyGraph(): boolean {
    return true;
  }
}
