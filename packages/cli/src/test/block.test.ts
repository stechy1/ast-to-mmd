import * as path from 'path';
import { Project, SourceFile } from 'ts-morph';

import { Convertor } from '../app';
import { IncrementalBlockIdGenerator } from '../app/block-id-generator/incremental-block-id-generator';
import { GraphParentGraphBlock } from '../app/graph-blocks/index';

describe('test', () => {

  let resourcesDir: string;
  let sourceFiles: SourceFile[];

  beforeAll(() => {
    resourcesDir = path.resolve(__dirname, 'resources');
    const project = new Project();
    project.addSourceFilesAtPaths(path.resolve(resourcesDir, '**/*.ts'));
    sourceFiles = project.getSourceFiles();
  })

  it('positive - should validate graph', () => {
    const convertor = new Convertor(sourceFiles, new IncrementalBlockIdGenerator());
    const graphResults = convertor.convert();
    for (const graphResult of graphResults) {
      console.log(graphResult.graph.render(0));
    }
    // astToMmd(sourceFiles, new IncrementalBlockIdGenerator(), path.resolve(process.cwd(), 'tmp'));
    // for (const sourceFile of sourceFiles) {
    //   const relativeSourcePath: string = path.normalize(sourceFile.getFilePath()).replace(resourcesDir, '');
    //   const relativeResultFilePath = relativeSourcePath.replace('.ts', '.mmd');
    // }
  });

});
