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
  const filepath = model.name.toPathName('%s/tests/events.test.ts');
  //load Profile/index.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //import { describe, it } from 'mocha';
  source.addImportDeclaration({
    moduleSpecifier: 'mocha',
    namedImports: [ 'describe', 'it' ]
  });
  //import { expect } from 'chai';
  source.addImportDeclaration({
    moduleSpecifier: 'chai',
    namedImports: [ 'expect' ]
  });
  //import listen from '../events/index.js';
  source.addImportDeclaration({
    moduleSpecifier: '../events/index.js',
    defaultImport: 'listen'
  });

  //export default function ProfileEventsTests() {}
  source.addFunction({
    isDefaultExport: true,
    name: model.name.toClassName('%sEventsTests'),
    statements: renderCode(TEMPLATE.DESCRIBE, {
      model: model.name.toClassName(),
      actions: [
        'batch', 'create', 'detail', 'get', 'purge', 'remove',
        'search', 'update', 'upsert',
        ...(model.store.restorable ? [ 'restore' ] : [])
      ].map(action => ({
        name: model.name.toEventName(`%s-${action}`)
      }))
    })
  });
};

export const TEMPLATE = {

DESCRIBE:
`describe('<%model%> Events', async () => {
  it('should register every generated event listener', async () => {
    const listeners = new Map<string, Function>();
    const emitter = {
      on(event: string, listener: Function) {
        listeners.set(event, listener);
      }
    };
    listen(emitter);
    <%#@:actions%>
      expect(listeners.get('<%name%>')).to.be.a('function');
    <%/@:actions%>
  });
});`,

};
