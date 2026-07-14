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
  //import Engine from '@stackpress/inquire/Engine';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/inquire/Engine',
    defaultImport: 'Engine'
  });
  //import Pgsql from '@stackpress/inquire/Pgsql';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/inquire/Pgsql',
    defaultImport: 'Pgsql'
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
    parameters: [{ name: 'engine', type: 'Engine', hasQuestionToken: true }],
    statements: renderCode(TEMPLATE.DESCRIBE, {
      model: model.name.toClassName(),
      first: columns.first()?.name.toString() || 'id',
      columns: columns.map(column => ({
        column: column.name.toString(),
        value: getSampleValue(column)
      })).toArray(),
      restore: model.store.restorable ? [{
        expect: 'expect(await actions.restore({})).to.have.length(1);'
      }] : [],
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
`const makeEngine = (responses: unknown[][] = []) => {
  const requests: unknown[] = [];
  const connection: any = {
    dialect: Pgsql,
    lastId: undefined,
    before: async () => undefined,
    format: (request: unknown) => request,
    query: async (request: unknown) => {
      requests.push(request);
      return responses.shift() || [];
    },
    resource: async () => ({}),
    transaction: async (callback: Function) => callback(connection)
  };
  return { engine: new Engine(connection), requests };
};

describe('<%model%> Actions', async () => {
  it('should retain the engine and generated store', async () => {
    const database = engine || makeEngine().engine;
    const actions = new <%model%>Actions(database, 'seed');
    expect(actions.engine).to.equal(database);
    expect(actions.store.constructor.name).to.equal('<%model%>Store');
  });
  it('should expose generated action methods', async () => {
    const actions = new <%model%>Actions(engine || makeEngine().engine);
    <%#@:methods%>
      expect(actions.<%method%>).to.be.a('function');
    <%/@:methods%>
  });
  it('should execute create, find, count, update, and delete', async () => {
    const input = {
      <%#@:columns%>
        <%column%>: <%value%>,
      <%/@:columns%>
    };
    const scalarized = new <%model%>Actions(makeEngine().engine)
      .store.scalarize(input);

    const createRuntime = makeEngine([ [ scalarized ] ]);
    const createActions = new <%model%>Actions(createRuntime.engine);
    (createActions.store as any).assert = () => null;
    (createActions as any).find = async () => null;
    const created = await createActions.create(input);
    expect(created).to.be.an('object');
    expect(createRuntime.requests.length).to.be.greaterThan(0);

    const findRuntime = makeEngine([ [ scalarized ] ]);
    const actions = new <%model%>Actions(findRuntime.engine);
    expect(await actions.find({ eq: { <%first%>: input.<%first%> } }))
      .to.be.an('object');

    const countRuntime = makeEngine([ [ { total: 2 } ] ]);
    expect(await new <%model%>Actions(countRuntime.engine).count({}))
      .to.equal(2);

    const updateRuntime = makeEngine([ [ scalarized ], [] ]);
    const updateActions = new <%model%>Actions(updateRuntime.engine);
    (updateActions.store as any).assert = () => null;
    const updated = await updateActions.update(
      { eq: { <%first%>: input.<%first%> } },
      input
    );
    expect(updated).to.have.length(1);

    const deleteRuntime = makeEngine([ [ scalarized ], [] ]);
    const deleted = await new <%model%>Actions(deleteRuntime.engine).delete({
      eq: { <%first%>: input.<%first%> }
    });
    expect(deleted).to.have.length(1);
  });
  it('should execute lifecycle queries', async () => {
    const runtime = makeEngine();
    const actions = new <%model%>Actions(runtime.engine);
    await actions.install();
    await actions.purge(true);
    await actions.uninstall();
    const target = actions.store.create();
    target.addField('extra', { type: 'VARCHAR', nullable: true });
    await actions.upgrade(target);
    expect(runtime.requests.length).to.be.greaterThan(3);
  });
  it('should delegate soft delete, restore, and upsert branches', async () => {
    const actions = new <%model%>Actions(makeEngine().engine);
    const calls: unknown[] = [];
    (actions as any).update = async (...args: unknown[]) => {
      calls.push(args);
      return [{ <%first%>: 'sample' }];
    };
    (actions as any).delete = async (...args: unknown[]) => {
      calls.push(args);
      return [{ <%first%>: 'sample' }];
    };
    (actions as any).create = async () => ({ <%first%>: 'created' });
    expect(await actions.remove({})).to.have.length(1);
    <%#@:restore%>
      <%expect%>
    <%/@:restore%>
    expect(await actions.upsert({ <%first%>: 'sample' })).to.be.an('object');
    expect(await actions.upsert({})).to.be.an('object');
    expect(calls.length).to.be.greaterThan(0);
  });
  it('should reject invalid create and update values', async () => {
    const actions = new <%model%>Actions(makeEngine().engine);
    (actions.store as any).assert = () => ({ <%first%>: 'Invalid' });
    let createError: unknown;
    let updateError: unknown;
    try { await actions.create({}); } catch (error) { createError = error; }
    try { await actions.update({}, {}); } catch (error) { updateError = error; }
    expect(createError).to.not.be.undefined;
    expect(updateError).to.not.be.undefined;
  });
  it('should execute every batch mode and collect failures', async () => {
    const actions = new <%model%>Actions(makeEngine().engine);
    (actions as any).upsert = async () => ({ <%first%>: 'upserted' });
    expect(await actions.batch([{}])).to.have.length(1);
    (actions as any).create = async () => ({ <%first%>: 'created' });
    expect(await actions.batch([{}], 'create')).to.have.length(1);
    (actions as any).find = async () => ({ <%first%>: 'sample' });
    (actions as any).update = async () => [{ <%first%>: 'updated' }];
    expect(await actions.batch(
      [{ <%first%>: 'sample' }],
      'update'
    )).to.have.length(1);
    (actions as any).find = async () => null;
    expect((await actions.batch([{}], 'update'))[0])
      .to.have.property('error');
    (actions as any).upsert = async () => {
      throw new Error('Expected failure');
    };
    expect((await actions.batch([{}]))[0]).to.have.property('error');
  });
});`,

};
