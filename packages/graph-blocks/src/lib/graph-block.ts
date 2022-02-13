import { randomUUID } from 'crypto';
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
  public readonly id = randomUUID().replace(/-/g, '_');

  protected constructor(public readonly type: GraphBlockType) {}

  public abstract render(indent: number): string;

  public getFirstId(): string {
    return this.id;
  }

  public getLastId(): string {
    return this.id;
  }

  protected generateSpace(count: number): string {
    return ' '.repeat(count);
  }

  protected renderLine(indent: number, lhsId: string, rhsId: string): string {
    return `${this.generateSpace(indent + 1)}${this.createLineBuilder(
      lhsId,
      rhsId
    ).build()}`;
  }

  protected createLineBuilder(lhsId: string, rhsId: string): LineBuilder {
    return new LineBuilder(lhsId, rhsId);
  }
}
