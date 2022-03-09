import {
  BigIntLiteral,
  BinaryExpression,
  Block,
  CallExpression,
  CatchClause,
  ClassDeclaration,
  ClassMemberTypes,
  Expression,
  ExpressionStatement,
  ForInStatement,
  ForOfStatement,
  ForStatement,
  FunctionDeclaration,
  IfStatement,
  JSDocTypeLiteral,
  MethodDeclaration,
  Node,
  NoSubstitutionTemplateLiteral,
  NumericLiteral,
  RegularExpressionLiteral,
  ReturnStatement,
  Statement,
  StringLiteral,
  SyntaxKind,
  ThrowStatement,
  TryStatement,
  TypeLiteralNode,
  UnaryExpression,
  VariableDeclaration,
  VariableDeclarationList
} from 'ts-morph';

import { BlockIdGenerator } from '../block-id-generator';
import {
  BinaryExpressionDeclarationGraphBlock,
  BlockDeclarationGraphBlock,
  EmptyGraphBlock,
  ForDeclarationGraphBlock,
  ForInDeclarationGraphBlock,
  ForOfDeclarationGraphBlock,
  GraphBlock,
  IfElseDeclarationGraphBlock,
  MethodCallGraphBlock,
  NamedBlockDeclarationGraphBlock,
  ParallelBlockDeclarationGraphBlock,
  ReturnDeclarationGraphBlock,
  TextGraphBlock,
  ThrowDeclarationGraphBlock,
  TryCatchDeclarationGraphBlock,
  VariableDeclarationGraphBlock,
  VariableDeclarationListGraphBlock
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
      case SyntaxKind.SingleLineCommentTrivia:                            //   2
        return new EmptyGraphBlock(this.idGenerator.generate());
      case SyntaxKind.NumericLiteral:                                     //   8
      case SyntaxKind.BigIntLiteral:                                      //   9
      case SyntaxKind.StringLiteral:                                      //  10
      case SyntaxKind.RegularExpressionLiteral:                           //  13
      case SyntaxKind.NoSubstitutionTemplateLiteral:                      //  14
      case SyntaxKind.TypeLiteral:                                        // 181
      case SyntaxKind.JSDocTypeLiteral:                                   // 320
      case SyntaxKind.Identifier:
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.processNodeLiteral(node);
      case SyntaxKind.MethodDeclaration:                                  // 168
        return this.processMethodOrFunction(node as MethodDeclaration);
      case SyntaxKind.Constructor:                                        // 170
        return new EmptyGraphBlock(this.idGenerator.generate());
      case SyntaxKind.CallExpression:
        return this.processExpressionStatement(node as ExpressionStatement);
      case SyntaxKind.PrefixUnaryExpression:                              // 218
      case SyntaxKind.PostfixUnaryExpression:                             // 219
        return this.processUnaryExpression(node as UnaryExpression);
      case SyntaxKind.BinaryExpression:                                   // 220
        return this.processBinaryExpression(node as BinaryExpression);
      case SyntaxKind.Block:                                              // 234
        return this.processBlock(node as Block);
      case SyntaxKind.VariableStatement:                                  // 236
      case SyntaxKind.PropertyDeclaration:                                // 166
        return new EmptyGraphBlock(this.idGenerator.generate());
      case SyntaxKind.ExpressionStatement:                                // 237
        return this.processExpressionStatement(node as ExpressionStatement);
      case SyntaxKind.IfStatement:                                        // 238
        return this.processIfStatement(node as IfStatement);
      case SyntaxKind.ForStatement:                                       // 241
        return this.processForStatement(node as ForStatement);
      case SyntaxKind.ForInStatement:                                     // 242
        return this.processForInStatement(node as ForInStatement);
      case SyntaxKind.ForOfStatement:                                     // 243
        return this.processForOfStatement(node as ForOfStatement);
      case SyntaxKind.ReturnStatement:                                    // 246
        return this.processReturnStatement(node as ReturnStatement);
      case SyntaxKind.ThrowStatement:                                     // 250
        return this.processThrowStatement(node as ThrowStatement);
      case SyntaxKind.TryStatement:                                       // 251
        return this.processTryStatement(node as TryStatement);
      case SyntaxKind.VariableDeclaration:                                // 253
        return this.processVariableDeclaration(node as VariableDeclaration);
      case SyntaxKind.VariableDeclarationList:                            // 254
        return this.processVariableDeclarationList(node as VariableDeclarationList);
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
   * @returns {@link ParallelBlockDeclarationGraphBlock}
   */
  public processClasses(classes: ClassDeclaration[]): GraphBlock {
    const blocks: GraphBlock[] = [];
    for (const classDeclaration of classes) {
      blocks.push(this.processClass(classDeclaration));
    }

    return new ParallelBlockDeclarationGraphBlock(this.idGenerator.generate(), blocks);
  }

  /**
   * Process any kind of {@link NumericLiteral | BigIntLiteral | StringLiteral | RegularExpressionLiteral | NoSubstitutionTemplateLiteral | TypeLiteralNode | JSDocTypeLiteral}
   *
   * @param node {@link NumericLiteral | BigIntLiteral | StringLiteral | RegularExpressionLiteral | NoSubstitutionTemplateLiteral | TypeLiteralNode | JSDocTypeLiteral}
   * @returns {@link TextGraphBlock}
   */
  protected processNodeLiteral(
    node:
      | NumericLiteral
      | BigIntLiteral
      | StringLiteral
      | RegularExpressionLiteral
      | NoSubstitutionTemplateLiteral
      | TypeLiteralNode
      | JSDocTypeLiteral
  ): GraphBlock {
    return new TextGraphBlock(this.idGenerator.generate(), node.getText());
  }

  /**
   * Process UnaryExpression
   *
   * kind = 218, 219
   *
   * @param expression {@link UnaryExpression}
   * @returns {@link TextGraphBlock}
   */
  protected processUnaryExpression(expression: UnaryExpression): GraphBlock {
    return new TextGraphBlock(this.idGenerator.generate(), expression.getText());
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
    const operator = expression.getOperatorToken();
    const lhs: Expression = expression.getLeft();
    const rhs: Expression = expression.getRight();

    const lhsBlock = this.processNode(lhs);
    const rhsBlock = this.processNode(rhs);

    return new BinaryExpressionDeclarationGraphBlock(
      this.idGenerator.generate(),
      lhsBlock,
      rhsBlock,
      operator.getText()
    );
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
   * @returns {@link IfElseDeclarationGraphBlock}
   */
  protected processIfStatement(statement: IfStatement): GraphBlock {
    const expression = statement.getExpression();
    const thenStatement = statement.getThenStatement();
    const elseStatement = statement.getElseStatement();

    // const condition = this.processNode(expression);
    const condition = expression.getText();
    const thanBlock = this.processNode(thenStatement);
    const elseBlock = elseStatement ? this.processNode(elseStatement) : undefined;

    return new IfElseDeclarationGraphBlock(
      this.idGenerator.generate(),
      condition,
      this.unwrapBlockDeclaration(thanBlock),
      elseBlock ? this.unwrapBlockDeclaration(elseBlock) : undefined
    );
  }

  /**
   * Process ReturnStatement
   *
   * kind = 246
   *
   * @param _statement {@link ReturnStatement}
   * @returns {@link ForDeclarationGraphBlock}
   */
  protected processReturnStatement(_statement: ReturnStatement): GraphBlock {
    return new ReturnDeclarationGraphBlock(this.idGenerator.generate());
  }

  /**
   * Process ForStatement
   *
   * kind = 241
   *
   * @param statement {@link ForStatement}
   * @returns {@link ForDeclarationGraphBlock}
   */
  protected processForStatement(statement: ForStatement): GraphBlock {
    const body: Statement = statement.getStatement();
    const initializer: VariableDeclarationList | Expression | undefined = statement.getInitializer();
    const condition: Expression | undefined = statement.getCondition();
    const incrementor: Expression | undefined = statement.getIncrementor();

    const bodyBlock = this.processNode(body);
    let initBlock;
    if (initializer) {
      initBlock = new TextGraphBlock(this.idGenerator.generate(), this.processNode(initializer));
    } else {
      initBlock = new EmptyGraphBlock(this.idGenerator.generate());
    }

    const testBlock = new TextGraphBlock(
      this.idGenerator.generate(),
      condition ? this.processNode(condition) : new EmptyGraphBlock(this.idGenerator.generate())
    );
    const updateBlock = new TextGraphBlock(
      this.idGenerator.generate(),
      incrementor ? this.processNode(incrementor) : new EmptyGraphBlock(this.idGenerator.generate())
    );

    return new ForDeclarationGraphBlock(
      this.idGenerator.generate(),
      this.unwrapBlockDeclaration(bodyBlock),
      initBlock,
      testBlock,
      updateBlock
    );
  }

  /**
   * Process ForInStatement
   *
   * kind = 242
   *
   * @param statement {@link ForInStatement}
   * @returns {@link ForInDeclarationGraphBlock}
   */
  protected processForInStatement(statement: ForInStatement): GraphBlock {
    const body: Statement = statement.getStatement();
    const initializer: Expression | VariableDeclarationList = statement.getInitializer();
    const expression = statement.getExpression();

    const bodyBlock = this.processNode(body);

    let initBlock;
    if (initializer) {
      initBlock = new TextGraphBlock(this.idGenerator.generate(), this.processNode(initializer));
    } else {
      initBlock = new EmptyGraphBlock(this.idGenerator.generate());
    }

    let expressionBlock;
    if (expression) {
      expressionBlock = new TextGraphBlock(this.idGenerator.generate(), this.processNode(expression));
    } else {
      expressionBlock = new EmptyGraphBlock(this.idGenerator.generate());
    }

    return new ForInDeclarationGraphBlock(this.idGenerator.generate(), this.unwrapBlockDeclaration(bodyBlock), initBlock, expressionBlock);
  }

  /**
   * Process ForOfStatement
   *
   * kind = 243
   *
   * @param statement {@link ForOfStatement}
   * @returns {@link ForOfDeclarationGraphBlock}
   */
  protected processForOfStatement(statement: ForOfStatement): GraphBlock {
    const body: Statement = statement.getStatement();
    const initializer: Expression | VariableDeclarationList = statement.getInitializer();
    const expression = statement.getExpression();

    const bodyBlock = this.processNode(body);

    let initBlock;
    if (initializer) {
      initBlock = new TextGraphBlock(this.idGenerator.generate(), this.processNode(initializer));
    } else {
      initBlock = new EmptyGraphBlock(this.idGenerator.generate());
    }

    let expressionBlock;
    if (expression) {
      expressionBlock = new TextGraphBlock(this.idGenerator.generate(), this.processNode(expression));
    } else {
      expressionBlock = new EmptyGraphBlock(this.idGenerator.generate());
    }

    return new ForOfDeclarationGraphBlock(this.idGenerator.generate(), this.unwrapBlockDeclaration(bodyBlock), initBlock, expressionBlock);
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
    const tryBlock: Block | undefined = statement.getTryBlock();
    const catchBlock: CatchClause | undefined = statement.getCatchClause();
    const finallyBlock = statement.getFinallyBlock();
    const tryGraphBlock = tryBlock ? this.processBlock(tryBlock) : undefined;
    const catchGraphBlock = catchBlock ? this.processBlock(catchBlock.getBlock()) : undefined;
    const finallyGraphBlock = finallyBlock ? this.processNode(finallyBlock) : undefined;

    return new TryCatchDeclarationGraphBlock(
      this.idGenerator.generate(),
      tryGraphBlock ? this.unwrapBlockDeclaration(tryGraphBlock) : undefined,
      catchGraphBlock ? this.unwrapBlockDeclaration(catchGraphBlock) : undefined,
      finallyGraphBlock ? this.unwrapBlockDeclaration(finallyGraphBlock) : undefined,
      catchGraphBlock ? this.idGenerator.generate() : undefined,
      finallyGraphBlock ? this.idGenerator.generate() : undefined
    );
  }

  /**
   * Process VariableDeclarationList
   *
   * kind = 254
   *
   * @param variableDeclarationList {@link VariableDeclarationList}
   * @returns {@link VariableDeclarationListGraphBlock}
   */
  protected processVariableDeclarationList(variableDeclarationList: VariableDeclarationList): GraphBlock {
    const variableDeclarations: VariableDeclaration[] = variableDeclarationList.getDeclarations();
    const variableDeclarationBlocks: VariableDeclarationGraphBlock[] = variableDeclarations.map((value) =>
      this.processVariableDeclaration(value)
    ) as VariableDeclarationGraphBlock[];

    return new VariableDeclarationListGraphBlock(this.idGenerator.generate(), variableDeclarationBlocks);
  }

  /**
   * Process VariableDeclaration
   *
   * kind = 256
   *
   * @param variableDeclaration {@link VariableDeclaration}
   * @returns {@link VariableDeclarationGraphBlock}
   */
  protected processVariableDeclaration(variableDeclaration: VariableDeclaration): GraphBlock {
    const variableName = variableDeclaration.getName();
    const initializer: Expression | undefined = variableDeclaration.getInitializer();

    const initializerBlock = initializer
      ? this.processNode(initializer)
      : undefined;

    return new VariableDeclarationGraphBlock(this.idGenerator.generate(), variableName, initializerBlock);
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

  /**
   * Unwrap children of {@link BlockDeclarationGraphBlock} into own array only
   * if parent block allows children unwrap.
   *
   * @param graphBlock {@link GraphBlock} Parent of children to unwrap.
   * @returns {@link GraphBlock[]} Children of a parent
   */
  protected unwrapBlockDeclaration(graphBlock: GraphBlock): GraphBlock[] {
    if (graphBlock instanceof BlockDeclarationGraphBlock && graphBlock.allowUnwrapChildren) {
      if (graphBlock.children.length !== 1) {
        throw Error('Too many children!');
      }

      return graphBlock.children[0];
    } else {
      return [graphBlock];
    }
  }
}
