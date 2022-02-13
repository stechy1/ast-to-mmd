import {
  Block,
  ClassDeclaration,
  MethodDeclaration,
  SourceFile,
  SyntaxKind,
} from 'ts-morph';

import {
  CodeParser,
  DecoratorType,
  FileType,
  includeFile,
} from '@ast-to-mmd/graph-parser';
import { GraphParentGraphBlock } from '@ast-to-mmd/graph-blocks';

function handlerMethodByType(
  analyzedClass: ClassDeclaration,
  decoratorType:
    | DecoratorType.COMMAND_HANDLER
    | DecoratorType.QUERY_HANDLER
    | DecoratorType.EVENT_HANDLER
): MethodDeclaration {
  let method = null;
  switch (decoratorType) {
    case DecoratorType.COMMAND_HANDLER:
    case DecoratorType.QUERY_HANDLER:
      method = 'execute';
      break;
    case DecoratorType.EVENT_HANDLER:
      method = 'handle';
      break;
    default:
      throw new Error('Unsupported decorator type!');
  }

  return analyzedClass.getInstanceMethodOrThrow(method);
}

export function astToMmd(sourceFiles: SourceFile[], outputPath: string): void {
  for (const sourceFile of sourceFiles) {
    const classes: ClassDeclaration[] = sourceFile.getClasses();
    const analyzedClass: ClassDeclaration | undefined = classes.pop();
    if (!analyzedClass) {
      return;
    }

    const [fileIncluded, decoratorType, fileType] = includeFile(analyzedClass);
    if (!fileIncluded) {
      continue;
    }

    if (
      decoratorType !== DecoratorType.COMMAND_HANDLER ||
      fileType !== FileType.HANDLER
    )
      continue;

    const parser = new CodeParser();

    // dočasně zpracovávám pouze command handler
    if (fileType === FileType.HANDLER) {
      const method: MethodDeclaration = handlerMethodByType(
        analyzedClass,
        decoratorType
      );
      const methodBody: Block = method.getFirstChildByKindOrThrow(
        SyntaxKind.Block
      );
      const graphBlock = parser.processBlock(methodBody);
      const parentGraphBlock = new GraphParentGraphBlock(graphBlock);
      console.log(parentGraphBlock.render(0));
    }
  }
}
