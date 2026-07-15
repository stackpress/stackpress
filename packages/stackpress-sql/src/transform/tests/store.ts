//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import type Column from 'stackpress-schema/Column';
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

function getSampleValue(column: Column) {
  const value = column.type.name === 'Boolean'
    ? 'true'
    : [ 'Number', 'Float', 'Integer' ].includes(column.type.name)
    ? '123'
    : [ 'Date', 'Time', 'Datetime' ].includes(column.type.name)
    ? "new Date('2024-01-01T00:00:00.000Z')"
    : [ 'Object', 'Json', 'Hash' ].includes(column.type.name)
    ? "{ sample: 'value' }"
    : column.type.enum
    ? JSON.stringify(Object.values(column.type.enum)[0])
    : "'sample'";
  return column.type.multiple ? `[${value}]` : value;
}

export default function generate(directory: Directory, model: Model) {
  const columns = model.columns.filter(
    column => !column.type.model && !column.type.fieldset
  );
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
  //import Create from '@stackpress/inquire/Create';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/inquire/Create',
    defaultImport: 'Create'
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
    parameters: [{ name: '_engine', type: 'Engine' }],
    statements: renderCode(TEMPLATE.DESCRIBE, {
      model: model.name.toClassName(),
      table: model.name.toTableName(),
      first: columns.first()?.name.toString() || 'id',
      columns: columns.map(column => ({
        column: column.name.toString(),
        snake: column.name.snakeCase,
        value: getSampleValue(column)
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
  it('should create every generated query builder', async () => {
    const store = new <%model%>Store();
    const input = {
      <%#@:columns%>
        <%column%>: <%value%>,
      <%/@:columns%>
    };
    const create = store.create();
    expect(create.build().table).to.equal('<%table%>');
    expect(store.alter()).to.not.be.undefined;
    const target = new Create('<%table%>');
    target.addField('extra', { type: 'VARCHAR', nullable: true });
    expect(store.alter(target)).to.not.be.undefined;
    expect(store.insert(input).build().table).to.equal('<%table%>');
    expect(store.delete({ eq: { <%first%>: input.<%first%> } }).build().table)
      .to.equal('<%table%>');
    expect(store.update(
      { eq: { <%first%>: input.<%first%> } },
      input
    ).build().table).to.equal('<%table%>');
  });
  it('should build selectors, paths, filters, and sorting', async () => {
    const store = new <%model%>Store();
    expect(store.paths('<%first%>')).to.have.length(1);
    expect(store.paths('*')[0]?.type).to.equal('wildcard');
    expect(store.paths('__unknown__')).to.have.length(0);
    expect(store.selectors('<%first%>')).to.have.length(1);
    expect(store.selectors([ '<%first%>', '<%first%>' ])).to.have.length(1);
    expect(store.selectors('*').length).to.be.greaterThan(0);
    expect(store.selectors('__unknown__')).to.have.length(0);
    expect(store.joins({})).to.deep.equal([]);
    const select = store.select({
      columns: [ '<%first%>' ],
      q: 'sample',
      eq: { active: -1, <%first%>: [ 'sample', null, undefined ] },
      ne: { <%first%>: 'other' },
      ge: { <%first%>: 'a' },
      le: { <%first%>: 'z' },
      like: { <%first%>: [ 'amp', 1 ] },
      has: { <%first%>: 'sample' },
      hasnt: { <%first%>: 'other' },
      sort: { <%first%>: 'asc', __unknown__: 'sideways' },
      skip: 1,
      take: 2
    });
    const build = select.build();
    expect(build).to.have.property('from');
    expect(build.offset).to.equal(1);
    expect(build.limit).to.equal(2);
  });
  it('should preserve unknown SQL values safely', async () => {
    const store = new <%model%>Store();
    expect(store.toSqlValue('__unknown__', undefined)).to.be.undefined;
    expect(store.toSqlValue('__unknown__', null)).to.be.null;
    expect(store.toSqlValue('__unknown__', 123)).to.equal('123');
  });
});`,

};
