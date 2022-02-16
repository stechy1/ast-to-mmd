import {
  BinaryExpression,
  Block,
  CallExpression,
  CatchClause,
  ClassDeclaration,
  ClassMemberTypes,
  ExpressionStatement,
  FunctionDeclaration,
  IfStatement,
  MethodDeclaration,
  Node,
  SyntaxKind,
  ThrowStatement,
  TryStatement
} from 'ts-morph';

import { BlockIdGenerator } from '../block-id-generator/block-id-generator';
import {
  BlockDeclarationGraphBlock,
  EmptyGraphBlock,
  GraphBlock,
  IfElseDeclarationGraphBlock,
  MethodCallGraphBlock,
  ThrowDeclarationGraphBlock,
  TryCatchDeclarationGraphBlock
} from '../graph-blocks';
import { NamedBlockDeclarationGraphBlock } from '../graph-blocks/named-block-declaration.graph-block';
import { ParallelBlockDeclarationGraphBlock } from '../graph-blocks/parallel-block-declaration.graph-block';

export class CodeParser {

  constructor(private readonly idGenerator: BlockIdGenerator) {}

  public processNodes(nodes: Node): GraphBlock {
    const graphBlocks: GraphBlock[] = [];
    for (const child of nodes.getChildren()) {
      const graphBlock = this.processNode(child);
      if (graphBlock) {
        graphBlocks.push(graphBlock);
      }
    }
    return new BlockDeclarationGraphBlock(this.idGenerator.generate(), graphBlocks);
  }

  public processNode(node: Node): GraphBlock {
    switch (node.getKind()) {
      case SyntaxKind.MethodDeclaration:                                  // 168
        return this.processMethod(node as MethodDeclaration);
      case SyntaxKind.BinaryExpression:                                   // 220
        return this.processBinaryExpression(node as BinaryExpression);
      case SyntaxKind.Block:                                              // 234
        return this.processBlock(node as Block);
      case SyntaxKind.VariableStatement:                                  // 236
        return new EmptyGraphBlock(this.idGenerator.generate());
      case SyntaxKind.ExpressionStatement:                                // 237
        return this.processExpressionStatement(node as ExpressionStatement);
      case SyntaxKind.IfStatement:                                        // 238
        return this.processIfStatement(node as IfStatement);
      case SyntaxKind.ThrowStatement:                                     // 250
        return this.processThrowStatement(node as ThrowStatement);
      case SyntaxKind.TryStatement:                                       // 251
        return this.processTryStatement(node as TryStatement);
      case SyntaxKind.ClassDeclaration:                                   // 256
        return this.processClass(node as ClassDeclaration);
      default:                                                            //  -1
        throw new Error('Unknown kind! ' + node.getKind());
    }
  }

  public processBlock(block: Block): GraphBlock {
    const blockChildren = block.getChildAtIndex(1);

    return this.processNodes(blockChildren);
  }

  public processFunctions(functions: FunctionDeclaration[]): GraphBlock {
    const blocks: GraphBlock[] = [];
    for (const functionDeclaration of functions) {
      const functionName: string | undefined = functionDeclaration.getName();
      if (!functionName) {
        continue;
      }
      const functionBody = functionDeclaration.getBody();
      if (!functionBody) {
        continue;
      }


      blocks.push(new NamedBlockDeclarationGraphBlock(this.idGenerator.generate(), [this.processBlock(functionBody as Block)], functionName));
    }

    return new ParallelBlockDeclarationGraphBlock(this.idGenerator.generate(), blocks);
  }

  public processClasses(classes: ClassDeclaration[]): GraphBlock {
    const blocks: GraphBlock[] = [];
    for (const classDeclaration of classes) {
      blocks.push(this.processClass(classDeclaration));
    }

    return new ParallelBlockDeclarationGraphBlock(this.idGenerator.generate(), blocks);
  }

  protected processClass(classDeclaration: ClassDeclaration): GraphBlock {
    const className: string | undefined = classDeclaration.getName();
    if (!className) {
      return new EmptyGraphBlock(this.idGenerator.generate());
    }

    return new NamedBlockDeclarationGraphBlock(this.idGenerator.generate(), this.processClassMembers(classDeclaration.getMembers()), className);
  }

  protected processClassMembers(classMembers: ClassMemberTypes[]): GraphBlock[] {
    const blocks: GraphBlock[] = [];

    for (const classMember of classMembers) {
      const block = this.processNode(classMember);
      if (block) {
        blocks.push(block);
      }
    }

    return blocks;
  }

  protected processMethod(method: MethodDeclaration): GraphBlock {
    const methodName: string | undefined = method.getName();
    if (!methodName) {
      return new EmptyGraphBlock(this.idGenerator.generate());
    }
    const body = method.getBody();
    if (!body) {
      return new EmptyGraphBlock(this.idGenerator.generate());
    }

    return new NamedBlockDeclarationGraphBlock(this.idGenerator.generate(), [this.processBlock(body as Block)], methodName);
  }

  protected processExpressionStatement(statement: ExpressionStatement): GraphBlock {
    const awaitOrCallExpression: ExpressionStatement | undefined =
      statement.getFirstChild();
    if (!awaitOrCallExpression) {
      return new EmptyGraphBlock(this.idGenerator.generate());
    }

    if (awaitOrCallExpression.getKind() === SyntaxKind.AwaitExpression) {
      const callExpression: CallExpression | undefined =
        awaitOrCallExpression.getFirstChildByKind(SyntaxKind.CallExpression);
      if (!callExpression) {
        return new EmptyGraphBlock(this.idGenerator.generate());
      }
      return new MethodCallGraphBlock(this.idGenerator.generate(), callExpression.getText());
    }

    return new MethodCallGraphBlock(this.idGenerator.generate(), awaitOrCallExpression.getText());
  }

  protected processTryStatement(statement: TryStatement): GraphBlock {
    const tryBlock: Block | undefined = statement.getFirstChildByKind(
      SyntaxKind.Block
    );
    if (!tryBlock) {
      return new EmptyGraphBlock(this.idGenerator.generate());
    }

    const catchBlock: CatchClause | undefined = statement.getFirstChildByKind(
      SyntaxKind.CatchClause
    );
    const tryGraphBlock = this.processBlock(tryBlock);
    const catchGraphBlock = catchBlock
      ? this.processBlock(catchBlock.getBlock())
      : undefined;

    return new TryCatchDeclarationGraphBlock(this.idGenerator.generate(), tryGraphBlock, catchGraphBlock);
  }

  protected processThrowStatement(statement: ThrowStatement): GraphBlock {
    return new ThrowDeclarationGraphBlock(this.idGenerator.generate(), statement.getText());
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

    return new IfElseDeclarationGraphBlock(this.idGenerator.generate(), condition, thanBlock, elseBlock);
  }

  protected processBinaryExpression(expression: BinaryExpression): GraphBlock {
    return new EmptyGraphBlock(this.idGenerator.generate(), );
  }
}
