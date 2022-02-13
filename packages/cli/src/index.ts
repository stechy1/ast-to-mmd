#!/usr/bin/env node

import clear = require('clear');
import figlet = require('figlet');
import { program } from 'commander';
import { Project, ProjectOptions } from 'ts-morph';

import { astToMmd } from '@ast-to-mmd/application';

clear();
console.log(figlet.textSync('AST-to-MMD CLI', { horizontalLayout: 'full' }));

program
  .version('1.0.0')
  .description('CLI for generating flow graphs from code')
  .option('-p', '--path', 'Define path where to find source files.')
  .option('-ts', '--tsConfig', 'Defines path to ts-config.json.')
  .option('-O', '--output <path>', 'Defines output path.')
  .parse(process.argv);

const options = program.opts();

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

const tsMorphOptions: ProjectOptions = {};
if (options['tsConfig']) {
  tsMorphOptions.tsConfigFilePath = options['tsConfig'];
}

const project = new Project(tsMorphOptions);
if (options['path']) {
  project.addSourceFileAtPath(options['path']);
}

astToMmd(project.getSourceFiles(), options['output']);
