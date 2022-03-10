import { createDirectory } from "@nrwl/workspace";

"use-strict";

import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

const root = process.cwd();

function generate(...paths) {
  for (const exploredPath of paths) {
    const childPath = path.join(root, exploredPath);
    const files = fs.readdirSync(childPath);
    const mmd = [];
    for (const file of files) {
      const filePath = path.join(childPath, file);
      const isDir = fs.lstatSync(filePath).isDirectory();
      if (isDir) continue;

      if (file.endsWith('.mmd')) {
        mmd.push(filePath);
      }
    }

    for (const mmdFile of mmd) {
      let destination = path.join(root, 'docu-graph-generated', path.basename(mmdFile).replace(/\.[^/.]+$/, ""));
      const cmd = `npx mmdc -i ${mmdFile} -o ${destination}.png`;
      console.log(`Executing: ${cmd}`);
      execSync(cmd, {timeout : 5000, stdio: 'inherit'});
    }
  }
}

createDirectory('docu-graph-generated');
generate('docu-graph-sources');
