import { ClassDeclaration, FunctionDeclaration, SourceFile } from 'ts-morph';

import { BlockIdGenerator } from './block-id-generator';
import {
  GraphBlock,
  GraphParentGraphBlock,
  NamedBlockDeclarationGraphBlock,
  ParallelBlockDeclarationGraphBlock,
} from './graph-blocks';
import { CodeParser } from './graph-parser';
import { GraphResult } from './graph-result';

/**
 * Class responsible for converting defined source files to graph.
 */
export class Convertor {

  /**
   * Instance of {@link CodeParser}
   */
  private readonly codeParser: CodeParser;

  /**
   * Creates new instance of {@link Convertor}.
   *
   * @param sourceFiles {@link SourceFile[]} Array of source files to process.
   * @param idGenerator {@link BlockIdGenerator} Generator of block IDs.
   */
  constructor(private readonly sourceFiles: SourceFile[], private readonly idGenerator: BlockIdGenerator) {
    this.codeParser = new CodeParser(idGenerator);
  }

  /**
   * Iterates through source files and generates graph for each file.
   */
  public convert(): GraphResult[] {
    const graphs: GraphResult[] = [];
    for (const sourceFile of this.sourceFiles) {
      const functions: FunctionDeclaration[] = sourceFile.getFunctions();
      const classes: ClassDeclaration[] = sourceFile.getClasses();

      const functionBlocks: GraphBlock = this.codeParser.processFunctions(functions);
      const classBlocks: GraphBlock = this.codeParser.processClasses(classes);

      const parentFunctionsBlock: GraphBlock = new NamedBlockDeclarationGraphBlock(
        this.idGenerator.generate(),
        [functionBlocks],
        'Functions'
      );
      const parentClassesBlock: GraphBlock = new NamedBlockDeclarationGraphBlock(
        this.idGenerator.generate(),
        [classBlocks],
        'Classes'
      );
      const parallelBlock: GraphBlock = new ParallelBlockDeclarationGraphBlock(this.idGenerator.generate(), [
        parentFunctionsBlock,
        parentClassesBlock,
      ]);

      graphs.push({
        sourceFile,
        graph: new GraphParentGraphBlock(this.idGenerator.generate(), parallelBlock),
      });
    }

    return graphs;
  }
}
