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
  const filepath = model.name.toPathName('%s/tests/%sActions.test.ts');
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
  //import ProfileActions from '../ProfileActions.js';
  source.addImportDeclaration({
    moduleSpecifier: model.name.toPathName('../%sActions.js'),
    defaultImport: model.name.toClassName('%sActions')
  });

  //export default function ProfileActionTests(engine: Engine) {}
  source.addFunction({
    isDefaultExport: true,
    name: model.name.toClassName('%sActionTests'),
    parameters: [{ name: 'engine', type: 'Engine' }],
    statements: renderCode(TEMPLATE.DESCRIBE, {
      model: model.name.toClassName(),
      methods: [
        'batch', 'count', 'create', 'delete', 'find', 'findAll',
        'install', 'purge', 'remove', 'uninstall', 'update',
        'upgrade', 'upsert',
        ...(model.store.restorable ? [ 'restore' ] : [])
      ].map(method => ({ method }))
    })
  });
};

export const TEMPLATE = {

DESCRIBE:
`describe('<%model%> Actions', async () => {
  it('should retain the engine and generated store', async () => {
    const actions = new <%model%>Actions(engine);
    expect(actions.engine).to.equal(engine);
    expect(actions.store.constructor.name).to.equal('<%model%>Store');
  });
  it('should expose generated action methods', async () => {
    const actions = new <%model%>Actions(engine);
    <%#@:methods%>
      expect(actions.<%method%>).to.be.a('function');
    <%/@:methods%>
  });
});`,

};
