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
      table: model.name.toTableName(),
      columns: model.columns.filter(column => !column.type.model).map(column => ({
        column: column.name.toString(),
        snake: column.name.snakeCase,
        value: column.type.multiple
          ? "['sample']"
          : column.type.name === 'Boolean'
          ? 'true'
          : [ 'Number', 'Float', 'Integer' ].includes(column.type.name)
          ? '123'
          : [ 'Date', 'Time', 'Datetime' ].includes(column.type.name)
          ? "new Date('2024-01-01T00:00:00.000Z')"
          : [ 'Object', 'Json', 'Hash' ].includes(column.type.name)
          ? "{ sample: 'value' }"
          : column.type.enum
          ? JSON.stringify(Object.values(column.type.enum)[0])
          : "'sample'"
      })).toArray()
    })
  });
};

export const TEMPLATE = {

DESCRIBE:
`describe('<%model%> Store', async () => {
  it('should expose its generated table', async () => {
    const store = new <%model%>Store();
    expect(store.table).to.equal('<%table%>');
  });
  it('should convert generated column values for SQL', async () => {
    const store = new <%model%>Store();
    expect(store.toSqlValue('__unknown__', 'sample')).to.equal('sample');
    <%#@:columns%>
      expect(store.toSqlValue('<%column%>', <%value%>)).to.not.be.undefined;
    <%/@:columns%>
  });
  it('should scalarize and unscalarize generated columns', async () => {
    const store = new <%model%>Store();
    const scalarized = store.scalarize({
      <%#@:columns%>
        <%column%>: <%value%>,
      <%/@:columns%>
    });
    <%#@:columns%>
      expect(scalarized).to.have.property('<%snake%>');
    <%/@:columns%>
    const actual = store.unscalarize(scalarized);
    <%#@:columns%>
      expect(actual).to.have.property('<%column%>');
    <%/@:columns%>
  });
});`,

};
