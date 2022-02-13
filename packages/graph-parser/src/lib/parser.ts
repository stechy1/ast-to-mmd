import {
  BinaryExpression,
  Block,
  CallExpression,
  CatchClause,
  ExpressionStatement,
  IfStatement,
  Node,
  SyntaxKind,
  ThrowStatement,
  TryStatement,
} from 'ts-morph';
import {
  BlockDeclarationGraphBlock,
  EmptyGraphBlock,
  GraphBlock,
  IfElseDeclarationGraphBlock,
  MethodCallGraphBlock,
  ThrowDeclarationGraphBlock,
  TryCatchDeclarationGraphBlock,
} from '@ast-to-mmd/graph-blocks';

export class CodeParser {
  public processNodes(nodes: Node): GraphBlock {
    const graphBlocks: GraphBlock[] = [];
    for (const child of nodes.getChildren()) {
      const graphBlock = this.processNode(child);
      if (graphBlock) {
        graphBlocks.push(graphBlock);
      }
    }
    return new BlockDeclarationGraphBlock(graphBlocks);
  }

  public processNode(node: Node): GraphBlock {
    switch (node.getKind()) {
      case SyntaxKind.ExpressionStatement:
        return this.processExpressionStatement(node as ExpressionStatement);
      case SyntaxKind.TryStatement:
        return this.processTryStatement(node as TryStatement);
      case SyntaxKind.IfStatement:
        return this.processIfStatement(node as IfStatement);
      case SyntaxKind.BinaryExpression:
        return this.processBinaryExpression(node as BinaryExpression);
      case SyntaxKind.ThrowStatement:
        return this.processThrowStatement(node as ThrowStatement);
      case SyntaxKind.Block:
        return this.processBlock(node as Block);
      case SyntaxKind.VariableStatement:
        return new EmptyGraphBlock();
      default:
        throw new Error('Unknown kind! ' + node.getKind());
    }
  }

  public processBlock(block: Block): GraphBlock {
    const blockChildren = block.getChildAtIndex(1);

    return this.processNodes(blockChildren);
  }

  protected processExpressionStatement(
    statement: ExpressionStatement
  ): GraphBlock {
    const awaitOrCallExpression: ExpressionStatement | undefined =
      statement.getFirstChild();
    if (!awaitOrCallExpression) {
      return new EmptyGraphBlock();
    }

    if (awaitOrCallExpression.getKind() === SyntaxKind.AwaitExpression) {
      const callExpression: CallExpression | undefined =
        awaitOrCallExpression.getFirstChildByKind(SyntaxKind.CallExpression);
      if (!callExpression) {
        return new EmptyGraphBlock();
      }
      return new MethodCallGraphBlock(callExpression.getText());
    }

    return new MethodCallGraphBlock(awaitOrCallExpression.getText());
  }

  protected processTryStatement(statement: TryStatement): GraphBlock {
    const tryBlock: Block | undefined = statement.getFirstChildByKind(
      SyntaxKind.Block
    );
    if (!tryBlock) {
      return new EmptyGraphBlock();
    }

    const catchBlock: CatchClause | undefined = statement.getFirstChildByKind(
      SyntaxKind.CatchClause
    );
    const tryGraphBlock = this.processBlock(tryBlock);
    const catchGraphBlock = catchBlock
      ? this.processBlock(catchBlock.getBlock())
      : undefined;

    return new TryCatchDeclarationGraphBlock(tryGraphBlock, catchGraphBlock);
  }

  protected processThrowStatement(statement: ThrowStatement): GraphBlock {
    return new ThrowDeclarationGraphBlock(statement.getText());
  }

  protected processIfStatement(statement: IfStatement): GraphBlock {
    const expression = statement.getExpression();
    const thenStatement = statement.getThenStatement();
    const elseStatement = statement.getElseStatement();

    // const condition = this.processNode(expression);
    const condition = expression.getText();
    const thanBlock = this.processNode(thenStatement);
    const elseBlock = elseStatement
      ? this.processNode(elseStatement)
      : undefined;

    return new IfElseDeclarationGraphBlock(condition, thanBlock, elseBlock);
  }

  protected processBinaryExpression(expression: BinaryExpression): GraphBlock {
    return new EmptyGraphBlock();
  }
}
