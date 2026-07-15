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

  //import type { HttpServer } from '@stackpress/ingest';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/ingest',
    namedImports: [ 'HttpServer' ]
  });
  //import { describe, it, before } from 'mocha';
  source.addImportDeclaration({
    moduleSpecifier: 'mocha',
    namedImports: [ 'describe', 'it', 'before' ]
  });
  //import { expect } from 'chai';
  source.addImportDeclaration({
    moduleSpecifier: 'chai',
    namedImports: [ 'expect' ]
  });

  //export default function ProfileEventsTests(server: HttpServer) {}
  source.addFunction({
    isDefaultExport: true,
    name: model.name.toClassName('%sEventsTests'),
    parameters: [{ name: 'server', type: 'HttpServer' }],
    statements: renderCode(TEMPLATE.DESCRIBE, {
      model: model.name.toClassName(),
      event: model.name.toEventName()
    })
  });
};

export const TEMPLATE = {

DESCRIBE:
`describe('<%model%> Events', async () => {
  before(async () => {
    await server.resolve('<%event%>-purge');
  });
  it('should create <%event%>', async () => {});
  it('should batch <%event%>', async () => {});
  it('should search <%event%>', async () => {});
  it('should get <%event%>', async () => {});
  it('should update <%event%>', async () => {});
  it('should remove <%event%>', async () => {});
  it('should restore <%event%>', async () => {});
});`,

};