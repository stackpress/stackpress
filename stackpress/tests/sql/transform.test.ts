//node
import fs from 'node:fs';
import path from 'node:path';
//tests
import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import { 
  mockProject,
  mockServer,
  mockTerminal, 
  mockTransformer,
  paths,
  savePrettyProject
} from '../helpers.js';
//src
import generate from '../../src/sql/transform/index.js';
  
describe('sql/transform', () => {
  it('should generate code files', async () => {
    //mock server
    const server = mockServer(paths.tests);
    const transformer = mockTransformer();
    const schema = await transformer.schema();
    const config = schema.plugin?.[paths.cwd + '/src/sql/transform'] || {};
    const cli = mockTerminal([], server);
    const project = mockProject(paths.tsconfig, paths.lib);
    const directory = project.createDirectory(paths.build);
    //run generate
    await generate({
      config,
      schema,
      transformer,
      cwd: paths.tests,
      cli,
      project: directory
    });
    await savePrettyProject(project);
  });
});
