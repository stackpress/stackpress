//node
import fs from 'node:fs';
import path from 'node:path';
//tests
import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import {
  mkdir, 
  mockProject,
  mockServer,
  mockTerminal, 
  mockTransformer,
  paths,
  rmdir,
  savePrettyProject
} from '../helpers.js';
//src
import generate from '../../src/view/transform/index.js';
  
describe('view/transform', () => {
  beforeEach(() => {
    mkdir(paths.build);
    mkdir(paths.output);
  });
  afterEach(() => {
    rmdir(paths.build);
    rmdir(paths.output);
  });
  it('should factory instantiate', async () => {
    //mock server
    const server = mockServer(paths.tests);
    const transformer = mockTransformer(paths.idea);
    const schema = await transformer.schema();
    const config = schema.plugin?.[paths.cwd + '/src/view/transform'] || {};
    const cli = mockTerminal([], server);
    const project = mockProject(paths.tsconfig, paths.output);
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
    const form = path.join(paths.build, 'User/components/form/NameFormField.tsx');
    const filter = path.join(paths.build, 'User/components/filter/ActiveFilterField.tsx');
    const list = path.join(paths.build, 'User/components/list/CreatedListFormat.tsx');
    const view = path.join(paths.build, 'User/components/view/CreatedViewFormat.tsx');
    const span = path.join(paths.build, 'User/components/span/CreatedSpanField.tsx');
    expect(fs.existsSync(form)).to.be.true;
    expect(fs.existsSync(filter)).to.be.true;
    expect(fs.existsSync(list)).to.be.true;
    expect(fs.existsSync(view)).to.be.true;
    expect(fs.existsSync(span)).to.be.true;

    const formCode = fs.readFileSync(form, 'utf-8');
    const filterCode = fs.readFileSync(filter, 'utf-8');
    const listCode = fs.readFileSync(list, 'utf-8');
    const viewCode = fs.readFileSync(view, 'utf-8');
    const spanCode = fs.readFileSync(span, 'utf-8');

    expect(formCode).to.include('export function NameFormField');
    expect(filterCode).to.include('export function ActiveFilterField');
    expect(listCode).to.include('export default function CreatedListFormat');
    expect(viewCode).to.include('export default function CreatedViewFormat');
    expect(spanCode).to.include('export function CreatedSpanField');
  });
});
