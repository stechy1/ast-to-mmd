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
  TryStatement,
  VariableDeclaration,
} from 'ts-morph';

import { BlockIdGenerator } from '../block-id-generator/block-id-generator';
import {
  BlockDeclarationGraphBlock,
  EmptyGraphBlock,
  GraphBlock,
  IfElseDeclarationGraphBlock,
  MethodCallGraphBlock,
  NamedBlockDeclarationGraphBlock,
  ParallelBlockDeclarationGraphBlock,
  ThrowDeclarationGraphBlock,
  TryCatchDeclarationGraphBlock,
} from '../graph-blocks';

/**
 * Parser of AST which than generate {@link GraphBlock} tree
 */
export class CodeParser {
  /**
   * Creates new instance of {@link CodeParser}
   *
   * @param idGenerator {@link BlockIdGenerator} ID generator implementation
   */
  constructor(private readonly idGenerator: BlockIdGenerator) {}

  /**
   * Process children of node from parameter and wrap result into {@link BlockDeclarationGraphBlock}
   *
   * @param node {@link Node} Parent node to process
   * @returns {@link BlockDeclarationGraphBlock}
   */
  public processNodes(node: Node): GraphBlock {
    const graphBlocks: GraphBlock[] = [];
    for (const child of node.getChildren()) {
      const graphBlock = this.processNode(child);
      if (graphBlock) {
        graphBlocks.push(graphBlock);
      }
    }
    return new BlockDeclarationGraphBlock(this.idGenerator.generate(), graphBlocks);
  }

  /**
   * Main processing method for each {@link Node} type
   *
   * @param node {@link Node}
   * @returns {@link GraphBlock} implementation
   * @throws Error When kind is not supported yet
   */
  public processNode(node: Node): GraphBlock {
    // prettier-ignore
    switch (node.getKind()) {
      case SyntaxKind.MethodDeclaration:                                  // 168
        return this.processMethodOrFunction(node as MethodDeclaration);
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
      case SyntaxKind.VariableDeclaration:                                // 253
        return this.processVariableDeclaration(node as VariableDeclaration);
      case SyntaxKind.FunctionDeclaration:                                // 255
        return this.processMethodOrFunction(node as FunctionDeclaration);
      case SyntaxKind.ClassDeclaration:                                   // 256
        return this.processClass(node as ClassDeclaration);
      default:                                                            //  -1
        throw new Error('Unknown kind! ' + node.getKind());
    }
  }

  /**
   * Process array of {@link FunctionDeclaration}
   *
   * @param functions {@link FunctionDeclaration[]}
   * @returns {@link ParallelBlockDeclarationGraphBlock} where each function is
   * wrapped into own {@link NamedBlockDeclarationGraphBlock}
   */
  public processFunctions(functions: FunctionDeclaration[]): GraphBlock {
    const blocks: GraphBlock[] = [];
    for (const functionDeclaration of functions) {
      blocks.push(this.processMethodOrFunction(functionDeclaration));
    }

    return new ParallelBlockDeclarationGraphBlock(this.idGenerator.generate(), blocks);
  }

  /**
   * Process array of {@link ClassDeclaration}
   *
   * @param classes {@link ClassDeclaration[]}
   * @returns
   */
  public processClasses(classes: ClassDeclaration[]): GraphBlock {
    const blocks: GraphBlock[] = [];
    for (const classDeclaration of classes) {
      blocks.push(this.processClass(classDeclaration));
    }

    return new ParallelBlockDeclarationGraphBlock(this.idGenerator.generate(), blocks);
  }

  /**
   * Process MethodDeclaration or FunctionDeclaration
   *
   * kind = 168 |
   *
   * @param method {@link MethodDeclaration}
   */
  protected processMethodOrFunction(method: MethodDeclaration | FunctionDeclaration): GraphBlock {
    const methodName: string | undefined = method.getName();
    if (!methodName) {
      return new EmptyGraphBlock(this.idGenerator.generate());
    }
    const body = method.getBody();
    if (!body) {
      return new EmptyGraphBlock(this.idGenerator.generate());
    }

    return new NamedBlockDeclarationGraphBlock(
      this.idGenerator.generate(),
      [this.processBlock(body as Block)],
      methodName
    );
  }

  /**
   * Process BinaryExpression
   *
   * kind = 220
   *
   * @param expression {@link BinaryExpression}
   */
  protected processBinaryExpression(expression: BinaryExpression): GraphBlock {
    return new EmptyGraphBlock(this.idGenerator.generate());
  }

  /**
   * Process Block
   *
   * kind = 234
   *
   * @param block {@link Block}
   */
  public processBlock(block: Block): GraphBlock {
    const blockChildren = block.getChildAtIndex(1);

    return this.processNodes(blockChildren);
  }

  /**
   * Process ExpressionStatement
   *
   * kind = 237
   *
   * @param statement {@link ExpressionStatement}
   */
  protected processExpressionStatement(statement: ExpressionStatement): GraphBlock {
    const awaitOrCallExpression: ExpressionStatement | undefined = statement.getFirstChild();
    if (!awaitOrCallExpression) {
      return new EmptyGraphBlock(this.idGenerator.generate());
    }

    if (awaitOrCallExpression.getKind() === SyntaxKind.AwaitExpression) {
      const callExpression: CallExpression | undefined = awaitOrCallExpression.getFirstChildByKind(
        SyntaxKind.CallExpression
      );
      if (!callExpression) {
        return new EmptyGraphBlock(this.idGenerator.generate());
      }
      return new MethodCallGraphBlock(this.idGenerator.generate(), callExpression.getText());
    }

    return new MethodCallGraphBlock(this.idGenerator.generate(), awaitOrCallExpression.getText());
  }

  /**
   * Process IfStatement
   *
   * kind = 238
   *
   * @param statement {@link IfStatement}
   */
  protected processIfStatement(statement: IfStatement): GraphBlock {
    const expression = statement.getExpression();
    const thenStatement = statement.getThenStatement();
    const elseStatement = statement.getElseStatement();

    // const condition = this.processNode(expression);
    const condition = expression.getText();
    const thanBlock = this.processNode(thenStatement);
    const elseBlock = elseStatement ? this.processNode(elseStatement) : undefined;

    return new IfElseDeclarationGraphBlock(this.idGenerator.generate(), condition, thanBlock, elseBlock);
  }

  /**
   * Process ThrowStatement
   *
   * kind = 250
   *
   * @param statement {@link ThrowStatement}
   */
  protected processThrowStatement(statement: ThrowStatement): GraphBlock {
    return new ThrowDeclarationGraphBlock(this.idGenerator.generate(), statement.getText());
  }

  /**
   * Process TryStatement
   *
   * kind = 251
   *
   * @param statement {@link TryStatement}
   */
  protected processTryStatement(statement: TryStatement): GraphBlock {
    const tryBlock: Block | undefined = statement.getFirstChildByKind(SyntaxKind.Block);
    if (!tryBlock) {
      return new EmptyGraphBlock(this.idGenerator.generate());
    }

    const catchBlock: CatchClause | undefined = statement.getFirstChildByKind(SyntaxKind.CatchClause);
    const tryGraphBlock = this.processBlock(tryBlock);
    const catchGraphBlock = catchBlock ? this.processBlock(catchBlock.getBlock()) : undefined;

    return new TryCatchDeclarationGraphBlock(this.idGenerator.generate(), tryGraphBlock, catchGraphBlock);
  }

  /**
   * Process VariableDeclaration
   *
   * kind = 256
   *
   * @param variableDeclaration {@link VariableDeclaration}
   */
  protected processVariableDeclaration(variableDeclaration: VariableDeclaration): GraphBlock {
    return new EmptyGraphBlock(this.idGenerator.generate());
  }

  /**
   * Process Class declaration
   *
   * kind = 256
   *
   * @param classDeclaration {@link ClassDeclaration}
   */
  protected processClass(classDeclaration: ClassDeclaration): GraphBlock {
    const className: string | undefined = classDeclaration.getName();
    if (!className) {
      return new EmptyGraphBlock(this.idGenerator.generate());
    }

    return new NamedBlockDeclarationGraphBlock(
      this.idGenerator.generate(),
      this.processClassMembers(classDeclaration.getMembers()),
      className
    );
  }

  /**
   * Process ClassMembers
   *
   * kind = {@link MethodDeclaration} (168) | {@link PropertyDeclaration} (166) |
   * {@link GetAccessorDeclaration} | {@link SetAccessorDeclaration} |
   * {@link ConstructorDeclaration} | {@link ClassStaticBlockDeclaration}
   *
   * @param classMembers {@link ClassMemberTypes[]}
   */
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
}
