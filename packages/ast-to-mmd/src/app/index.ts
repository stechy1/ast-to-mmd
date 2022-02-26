// import {
//   Block,
//   ClassDeclaration, FunctionDeclaration,
//   MethodDeclaration,
//   SourceFile,
//   SyntaxKind
// } from 'ts-morph';
//
// import {
//   CodeParser,
//   DecoratorType,
//   FileType,
//   includeFile,
// } from './graph-parser';
// import { BlockDeclarationGraphBlock, EmptyGraphBlock, GraphBlock, GraphParentGraphBlock } from './graph-blocks';
// import * as assert from 'assert';
// import { BlockIdGenerator } from './block-id-generator/block-id-generator';
// import { NamedBlockDeclarationGraphBlock } from './graph-blocks/named-block-declaration.graph-block';
// import { ParallelBlockDeclarationGraphBlock } from './graph-blocks/parallel-block-declaration.graph-block';
//
// function handlerMethodByType(
//   analyzedClass: ClassDeclaration,
//   decoratorType:
//     | DecoratorType.COMMAND_HANDLER
//     | DecoratorType.QUERY_HANDLER
//     | DecoratorType.EVENT_HANDLER
// ): MethodDeclaration {
//   let method = null;
//   switch (decoratorType) {
//     case DecoratorType.COMMAND_HANDLER:
//     case DecoratorType.QUERY_HANDLER:
//       method = 'execute';
//       break;
//     case DecoratorType.EVENT_HANDLER:
//       method = 'handle';
//       break;
//     default:
//       throw new Error('Unsupported decorator type!');
//   }
//
//   return analyzedClass.getInstanceMethodOrThrow(method);
// }

export { Convertor } from './convertor';
export { Exporter } from './exporter';

// export function astToMmd(sourceFiles: SourceFile[], idGenerator: BlockIdGenerator, outputPath: string): void {
//   for (const sourceFile of sourceFiles) {
//
//     const functions: FunctionDeclaration[] = sourceFile.getFunctions();
//     const classes: ClassDeclaration[] = sourceFile.getClasses();
//
//     const functionBlocks: GraphBlock[] = processFunctions(functions, idGenerator);
//     const classBlocks: GraphBlock[] = processClasses(classes, idGenerator);
//
//     const parentFunctionsBlock: GraphBlock = new NamedBlockDeclarationGraphBlock(idGenerator.generate(), functionBlocks, 'Functions');
//     const parentClassesBlock: GraphBlock = new NamedBlockDeclarationGraphBlock(idGenerator.generate(), classBlocks, 'Classes');
//     const parallelBlock: GraphBlock = new ParallelBlockDeclarationGraphBlock(idGenerator.generate(), [parentFunctionsBlock, parentClassesBlock]);
//
//     const parentGraphBlock = new GraphParentGraphBlock(idGenerator.generate(), parallelBlock);
//     console.log(parentGraphBlock.render(0));
//
//     // const classes: ClassDeclaration[] = sourceFile.getClasses();
//     // const analyzedClass: ClassDeclaration | undefined = classes.pop();
//     // if (!analyzedClass) {
//     //   return;
//     // }
//     //
//     // const [fileIncluded, decoratorType, fileType] = includeFile(analyzedClass);
//     // if (!fileIncluded) {
//     //   continue;
//     // }
//     //
//     // assert(decoratorType !== undefined, 'Decorator type is not defined!');
//     //
//     // // if (
//     // //   decoratorType !== DecoratorType.COMMAND_HANDLER ||
//     // //   fileType !== FileType.HANDLER
//     // // )
//     // //   continue;
//     //
//     // const parser = new CodeParser();
//     // let parentFileBlock: Block[];
//     //
//     // // dočasně zpracovávám pouze command handler
//     // if (fileType === FileType.HANDLER && (decoratorType in [DecoratorType.COMMAND_HANDLER, DecoratorType.QUERY_HANDLER, DecoratorType.EVENT_HANDLER])) {
//     //   const method: MethodDeclaration = handlerMethodByType(
//     //     analyzedClass,
//     //     decoratorType
//     //   );
//     //   parentFileBlock = method.getFirstChildByKindOrThrow(
//     //     SyntaxKind.Block
//     //   );
//     // } else if (fileType === FileType.SERVICE) {
//     //   parentFileBlock = analyzedClass.getInstanceMethods();
//     // }
//     //
//     // if (!parentFileBlock) {
//     //   continue;
//     // }
//     //
//     //   const graphBlock = parser.processBlock(parentFileBlock);
//     //   const parentGraphBlock = new GraphParentGraphBlock(graphBlock);
//     //   console.log(parentGraphBlock.render(0));
//   }
// }
//
// function processFunctions(functions: FunctionDeclaration[], idGenerator: BlockIdGenerator): GraphBlock[] {
//   const blocks: GraphBlock[] = [];
//   for (const functionDeclaration of functions) {
//     const functionBody = functionDeclaration.getBody();
//     if (!functionBody) {
//       continue;
//     }
//     const functionName: string = functionDeclaration.getName();
//
//
//     blocks.push(new NamedBlockDeclarationGraphBlock(idGenerator.generate(), [], functionName));
//   }
//
//   return blocks;
// }
//
// function processClasses(classes: ClassDeclaration[], idGenerator: BlockIdGenerator): GraphBlock[] {
//   const blocks: GraphBlock[] = [];
//   for (const classDeclaration of classes) {
//     const className: string = classDeclaration.getName();
//
//     blocks.push(new NamedBlockDeclarationGraphBlock(idGenerator.generate(), [], className));
//   }
//
//   return blocks;
// }
