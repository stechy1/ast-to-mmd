import {
  CallExpression,
  ClassDeclaration,
  Decorator,
  LeftHandSideExpression,
  ts,
} from 'ts-morph';

export enum DecoratorType {
  INJECTABLE,
  CONTROLLER,
  COMMAND_HANDLER,
  QUERY_HANDLER,
  EVENT_HANDLER,
}
const decoratorTypeMap: Record<string, DecoratorType> = {
  Injectable: DecoratorType.INJECTABLE,
  Controller: DecoratorType.CONTROLLER,
  CommandHandler: DecoratorType.COMMAND_HANDLER,
  QueryHandler: DecoratorType.QUERY_HANDLER,
  EventHandler: DecoratorType.EVENT_HANDLER,
};

export enum FileType {
  CONTROLLER,
  FACADE,
  SERVICE,
  HANDLER,
}
const fileTypeMap: Record<string, FileType> = {
  Controller: FileType.CONTROLLER,
  Facade: FileType.FACADE,
  Service: FileType.SERVICE,
  Handler: FileType.HANDLER,
};

/**
 * Based on the analyzed class is defined,
 * whether the MMD graph is generated or not.
 *
 * @param analyzedClass {ClassDeclaration} Analyzed class
 * @returns {[boolean, DecoratorType?, FileType?]} True, whether the graph will be analyzed or False
 * <br>In case of True, {@link DecoratorType} and {@link FileType} will be also returned
 */
export function includeFile(
  analyzedClass: ClassDeclaration
): [boolean, DecoratorType?, FileType?] {
  if (!analyzedClass) {
    return [false];
  }
  const decorators: Decorator[] = analyzedClass.getDecorators();
  const decoratorType = resolveDecoratorType(decorators);
  if (!decoratorType) {
    return [false];
  }

  const fileType = resolveFileType(analyzedClass);
  if (!fileType) {
    return [false];
  }

  return [true, decoratorType, fileType];
}

function resolveDecoratorType(
  decorators: Decorator[]
): DecoratorType | undefined {
  for (const decorator of decorators) {
    const callExpression: CallExpression<ts.CallExpression> | undefined =
      decorator.getCallExpression();
    if (!callExpression) {
      continue;
    }
    const lhsExpression: LeftHandSideExpression =
      callExpression.getExpression();

    const decoratorName = lhsExpression.getText();
    const decoratorType = decoratorTypeMap[decoratorName];
    if (decoratorType) {
      return decoratorType;
    }
  }

  return undefined;
}

function resolveFileType(
  analyzedClass: ClassDeclaration
): FileType | undefined {
  const className: string | undefined = analyzedClass.getName();
  if (!className) {
    return undefined;
  }

  for (const fileTypeEntry in fileTypeMap) {
    if (className.endsWith(fileTypeEntry)) {
      return fileTypeMap[fileTypeEntry];
    }
  }

  return undefined;
}
