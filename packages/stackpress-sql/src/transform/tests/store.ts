//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import { 
  loadProjectFile, 
  renderCode 
} from 'stackpress-schema/transform/helpers';

export const samples = [
  {
    slug: 'foo-bar',
    string: 'foobar',
    number: 123,
    boolean: true,
    date: new Date(),
    array: ['foo', 'bar'],
    object: { foo: 'bar' }
  },
  {
    slug: 'bar-foo',
    string: 'barfoo',
    number: 321,
    boolean: false,
    date: new Date(),
    array: ['bar', 'foo'],
    object: { bar: 'foo' }
  },
  {
    slug: 'foo-zoo',
    string: 'foozoo',
    number: 123,
    boolean: true,
    date: new Date(),
    array: ['foo', 'zoo'],
    object: { foo: 'zoo' }
  },
  {
    slug: 'bar-zoo',
    string: 'barzoo',
    number: 321,
    boolean: false,
    date: new Date(),
    array: ['bar', 'zoo'],
    object: { bar: 'zoo' }
  }
];

export default function generate(directory: Directory, model: Model) {
  const filepath = model.name.toPathName('%s/tests/%sStore.test.ts');
  //load Profile/index.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);
  
  //import { describe, it } from 'mocha';
  source.addImportDeclaration({
    moduleSpecifier: 'mocha',
    namedImports: ['describe', 'it']
  });
  //import { expect } from 'chai';
  source.addImportDeclaration({
    moduleSpecifier: 'chai',
    namedImports: [ 'expect' ]
  });
  //import type Engine from '@stackpress/inquire/Engine';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/inquire/Engine',
    defaultImport: 'Engine'
  });
  //import ProfileStore from '../ProfileStore.js';
  source.addImportDeclaration({
    moduleSpecifier: model.name.toPathName('../%sStore.js'),
    defaultImport: model.name.toClassName('%sStore')
  });

  //export default function ProfileStoreTests(engine: Engine) {}
  source.addFunction({
    isDefaultExport: true,
    name: model.name.toClassName('%sStoreTests'),
    parameters: [{ name: 'engine', type: 'Engine' }],
    statements: renderCode(TEMPLATE.DESCRIBE, {
      model: model.name.toClassName(),
    })
  });
};

export const TEMPLATE = {

DESCRIBE:
`describe('<%model%> Store', async () => {
  it('should make count query', async () => {});
  it('should make alter query', async () => {});
  it('should make delete query', async () => {});
  it('should make insert query', async () => {});
  it('should make select query', async () => {});
  it('should make update query', async () => {});
  it('should make where clause', async () => {});
});`,

};