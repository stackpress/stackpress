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
  //import ProfileActions from '../ProfileActions.js';
  source.addImportDeclaration({
    moduleSpecifier: model.name.toPathName('../%sActions.js'),
    defaultImport: model.name.toClassName('%sActions')
  });

  const actions = [
    { event: 'batch', methods: [ 'batch' ] },
    { event: 'create', methods: [ 'create' ] },
    { event: 'detail', methods: [ 'find' ] },
    { event: 'get', methods: [ 'find' ] },
    { event: 'purge', methods: [ 'purge' ] },
    { event: 'remove', methods: [ 'remove' ] },
    { event: 'search', methods: [ 'findAll', 'count' ] },
    { event: 'update', methods: [ 'update' ] },
    { event: 'upsert', methods: [ 'upsert' ] },
    ...(model.store.restorable
      ? [{ event: 'restore', methods: [ 'restore' ] }]
      : [])
  ];
  for (const action of actions) {
    source.addImportDeclaration({
      moduleSpecifier: `../events/${action.event}.js`,
      defaultImport: model.name.toClassName(`%s${action.event}Event`)
    });
  }

  //export default function ProfileEventsTests() {}
  source.addFunction({
    isDefaultExport: true,
    name: model.name.toClassName('%sEventsTests'),
    statements: renderCode(TEMPLATE.DESCRIBE, {
      model: model.name.toClassName(),
      actions: actions.map(action => ({
        name: model.name.toEventName(`%s-${action.event}`)
      })),
      cases: actions.map(action => ({
        handler: model.name.toClassName(`%s${action.event}Event`),
        methods: JSON.stringify(action.methods)
      }))
    })
  });
};

export const TEMPLATE = {

DESCRIBE:
`const createRoute = (database: unknown = {}) => {
  const values = new Map<string, unknown>([
    [ 'columns', [ '*' ] ],
    [ 'key', 'id' ],
    [ 'mode', 'upsert' ],
    [ 'rows', [{}] ],
    [ 'value', 'sample' ]
  ]);
  const data: any = (name?: string) => name
    ? values.get(name) ?? 'sample'
    : Object.fromEntries(values);
  data.has = (name: string) => values.has(name);
  data.path = (name: string, fallback: unknown) => (
    values.get(name) ?? fallback
  );
  data.set = (name: string, value: unknown) => values.set(name, value);
  const calls: unknown[] = [];
  const res: any = {
    body: undefined,
    code: 200,
    results: (value: unknown) => calls.push([ 'results', value ]),
    rows: (value: unknown, total: unknown) => (
      calls.push([ 'rows', value, total ])
    ),
    set: (...args: unknown[]) => calls.push([ 'set', ...args ]),
    setError: (...args: unknown[]) => {
      calls.push([ 'error', ...args ]);
      return res;
    },
    statusCode: (...args: unknown[]) => {
      calls.push([ 'status', ...args ]);
      return res;
    }
  };
  return {
    calls,
    req: { data },
    res,
    ctx: {
      plugin: () => database,
      config: { path: () => 'seed' }
    }
  };
};

const eventCases = [
  <%#@:cases%>
    { handler: <%handler%>, methods: <%methods%> },
  <%/@:cases%>
];

describe('<%model%> Events', async () => {
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
  it('should execute every generated event handler', async () => {
    for (const event of eventCases) {
      const originals = new Map<string, unknown>();
      for (const method of event.methods) {
        originals.set(method, (<%model%>Actions.prototype as any)[method]);
        (<%model%>Actions.prototype as any)[method] = async () => (
          method === 'count' ? 1
          : method === 'find' ? { id: 'sample' }
          : [ { id: 'sample' } ]
        );
      }
      const route = createRoute();
      try {
        await event.handler(route as any);
        expect(route.calls.length).to.be.greaterThan(0);
      } finally {
        for (const [ method, original ] of originals) {
          (<%model%>Actions.prototype as any)[method] = original;
        }
      }
    }
  });
  it('should pass through completed responses and missing databases', async () => {
    for (const event of eventCases) {
      const completed = createRoute();
      completed.res.body = { done: true };
      await event.handler(completed as any);
      expect(completed.calls).to.have.length(0);

      const missing = createRoute(undefined);
      missing.ctx.plugin = () => undefined;
      await event.handler(missing as any);
      expect(missing.calls).to.have.length(0);
    }
  });
  it('should convert action failures into response errors', async () => {
    for (const event of eventCases) {
      const originals = new Map<string, unknown>();
      for (const method of event.methods) {
        originals.set(method, (<%model%>Actions.prototype as any)[method]);
        (<%model%>Actions.prototype as any)[method] = async () => {
          throw new Error('Expected failure');
        };
      }
      const route = createRoute();
      try {
        await event.handler(route as any);
        expect(route.calls.some(call => (call as unknown[])[0] === 'error'))
          .to.be.true;
      } finally {
        for (const [ method, original ] of originals) {
          (<%model%>Actions.prototype as any)[method] = original;
        }
      }
    }
  });
});`,

};
