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
import generate from '../../src/view/transform/index.js';
  
describe('view/transform', () => {
  it('should generate code files', async () => {
    //mock server
    const server = mockServer(paths.tests);
    const transformer = mockTransformer();
    const schema = await transformer.schema();
    const config = schema.plugin?.[paths.cwd + '/src/view/transform'] || {};
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
    const form = path.join(paths.build, 'KitchenSinkFixture/components/form/ActiveFormField.tsx');
    const filter = path.join(paths.build, 'KitchenSinkFixture/components/filter/CurrencyFilterField.tsx');
    const list = path.join(paths.build, 'KitchenSinkFixture/components/list/ActiveListFormat.tsx');
    const view = path.join(paths.build, 'KitchenSinkFixture/components/view/ActiveViewFormat.tsx');
    const span = path.join(paths.build, 'KitchenSinkFixture/components/span/AgeSpanField.tsx');
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

    expect(formCode).to.include('export function ActiveFormField');
    expect(filterCode).to.include('export function CurrencyFilterField');
    expect(listCode).to.include('export default function ActiveListFormat');
    expect(viewCode).to.include('export default function ActiveViewFormat');
    expect(spanCode).to.include('export function AgeSpanField');
  });
});
