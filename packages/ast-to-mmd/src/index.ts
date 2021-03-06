#!/usr/bin/env node

import clear = require('clear');
import { program } from 'commander';
import figlet = require('figlet');
import { readFileSync } from 'fs';
import * as path from 'path';
import { Project, ProjectOptions } from 'ts-morph';

import { Convertor, Exporter } from './app';
import { IncrementalBlockIdGenerator, UuidBlockIdGenerator } from "./app/block-id-generator";
import { FileFilter, FileFilterFactory } from './app/file-filter';

clear();
console.log(figlet.textSync('AST-to-MMD CLI', { horizontalLayout: 'full' }));

const version = JSON.parse(
  readFileSync(path.resolve(__dirname, '../../../../', 'package.json'), { encoding: 'utf-8' })
).version;

program
  .version(version)
  .description('CLI for generating flow graphs from code.')
  .option('-p, --path <path>', 'Define path where to find source file.')
  .option('-d, --directory <path>', 'Define path to directory where to find source files.')
  .option('-ts, --tsConfig <tsConfig>', 'Defines path to ts-config.json.')
  .option('-o, --output <output>', 'Defines output path. (currently not used)')
  .option('-g, --idGenerator <type>', 'Defines type of ID generator.', 'incremental')
  .option('-f, --fileFilter <path>', 'Define path to file filter rules.', false)
  .option('-e, --experimental', 'Enables experimental mode - when unknown kind is found, empty block is generated instead of throwing exception')
  .parse(process.argv);

const options = program.opts();

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(1);
}

const cwd = process.cwd();

const tsMorphOptions: ProjectOptions = {};
if (options['tsConfig']) {
  tsMorphOptions.tsConfigFilePath = path.resolve(cwd, options['tsConfig']);
}

const project = new Project(tsMorphOptions);
if (options['path']) {
  project.addSourceFileAtPath(path.resolve(cwd, options['path']));
}
if (options['directory']) {
  project.addSourceFilesAtPaths(path.resolve(cwd, options['directory']));
}
let idGenerator = new UuidBlockIdGenerator();
if (options['idGenerator'] === 'incremental') {
  idGenerator = new IncrementalBlockIdGenerator();
}

const experimentalMode = options['experimental'] !== undefined;
const fileFilterFactory = new FileFilterFactory();
const fileFilter: FileFilter = fileFilterFactory.create(cwd, options['fileFilter']);
const convertor = new Convertor(project.getSourceFiles(), fileFilter, idGenerator, experimentalMode);
const graphResults = convertor.convert();

const exporter = new Exporter(options['output']);
exporter.export(graphResults);
