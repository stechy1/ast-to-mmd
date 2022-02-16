import { Block, ClassDeclaration, FunctionDeclaration, SourceFile } from 'ts-morph';

import { BlockIdGenerator } from './block-id-generator/block-id-generator';
import { GraphBlock, GraphParentGraphBlock } from './graph-blocks/index';
import { NamedBlockDeclarationGraphBlock } from './graph-blocks/named-block-declaration.graph-block';
import { ParallelBlockDeclarationGraphBlock } from './graph-blocks/parallel-block-declaration.graph-block';
import { GraphResult } from './graph-result';
import { CodeParser } from './graph-parser';

export class Convertor {

  private readonly codeParser: CodeParser;

  constructor(
    private readonly sourceFiles: SourceFile[],
    private readonly idGenerator: BlockIdGenerator) {
    this.codeParser = new CodeParser(idGenerator);
  }

  public convert(): GraphResult[] {
    const graphs: GraphResult[] = [];
    for (const sourceFile of this.sourceFiles) {

      const functions: FunctionDeclaration[] = sourceFile.getFunctions();
      const classes: ClassDeclaration[] = sourceFile.getClasses();

      const functionBlocks: GraphBlock = this.codeParser.processFunctions(functions);
      const classBlocks: GraphBlock = this.codeParser.processClasses(classes);

      const parentFunctionsBlock: GraphBlock = new NamedBlockDeclarationGraphBlock(this.idGenerator.generate(), [functionBlocks], 'Functions');
      const parentClassesBlock: GraphBlock = new NamedBlockDeclarationGraphBlock(this.idGenerator.generate(), [classBlocks], 'Classes');
      const parallelBlock: GraphBlock = new ParallelBlockDeclarationGraphBlock(this.idGenerator.generate(), [parentFunctionsBlock, parentClassesBlock]);

      graphs.push({
        sourceFile,
        graph: new GraphParentGraphBlock(this.idGenerator.generate(), parallelBlock)
      });
    }

    return graphs;
  }

}
