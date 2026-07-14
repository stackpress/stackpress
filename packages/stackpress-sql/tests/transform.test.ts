//modules
import { IndentationText, Project } from 'ts-morph';
import { describe, it } from 'mocha';
import { expect } from 'chai';
//stackpress-schema
import Schema from 'stackpress-schema/Schema';
//stackpress-sql
import generateModelTests from '../src/transform/tests/aggregate.js';
import generateRootTests from '../src/transform/tests/root.js';
import generateActionsTests from '../src/transform/tests/actions.js';
import generateEventsTests from '../src/transform/tests/events.js';
import generateStoreTests from '../src/transform/tests/store.js';

function createProject() {
  return new Project({
    useInMemoryFileSystem: true,
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces
    }
  });
}

function createSchema(names = [ 'Profile' ]) {
  return Schema.make({
    model: Object.fromEntries(names.map(name => [
      name,
      {
        name,
        mutable: true,
        attributes: {},
        columns: [{
          name: 'id',
          type: 'String',
          required: true,
          multiple: false,
          attributes: { id: true }
        }]
      }
    ]))
  });
}

function createTest(
  project: Project,
  filepath: string,
  name: string
) {
  project.createSourceFile(
    filepath,
    `export default function ${name}() {}`
  );
}

describe('sql/transform/tests', () => {
  it('should discover and aggregate every model runtime test', () => {
    const project = createProject();
    const directory = project.createDirectory('/client');
    const model = Array.from(createSchema().models.values())[0];

    createTest(
      project,
      '/client/Profile/tests/ProfileSchema.test.ts',
      'ProfileSchemaTests'
    );
    createTest(
      project,
      '/client/Profile/tests/ProfileStore.test.ts',
      'ProfileStoreTests'
    );
    createTest(
      project,
      '/client/Profile/tests/columns/IdColumn.test.ts',
      'IdColumnTests'
    );
    createTest(
      project,
      '/client/Profile/tests/future/Plugin.test.ts',
      'PluginTests'
    );

    generateModelTests(directory, model);
    const first = project
      .getSourceFileOrThrow('/client/Profile/tests.ts')
      .getFullText();
    generateModelTests(directory, model);
    const second = project
      .getSourceFileOrThrow('/client/Profile/tests.ts')
      .getFullText();

    expect(second).to.equal(first);
    expect(second.match(/^import /gm)).to.have.length(4);
    expect(second).to.contain('./tests/ProfileSchema.test.js');
    expect(second).to.contain('./tests/ProfileStore.test.js');
    expect(second).to.contain('./tests/columns/IdColumn.test.js');
    expect(second).to.contain('./tests/future/Plugin.test.js');
    expect(second.indexOf('ProfileSchema.test.js')).to.be.lessThan(
      second.indexOf('ProfileStore.test.js')
    );
    expect(second.match(/runTestRunner\(/g)).to.have.length(5);
  });

  it('should generate a deterministic root runner for every model', () => {
    const project = createProject();
    const directory = project.createDirectory('/client');
    const schema = createSchema([ 'Session', 'Article', 'Profile' ]);

    generateRootTests(directory, schema);
    const first = project.getSourceFileOrThrow('/client/tests.ts').getFullText();
    generateRootTests(directory, schema);
    const second = project.getSourceFileOrThrow('/client/tests.ts').getFullText();

    expect(second).to.equal(first);
    expect(second.indexOf('./Article/tests.js')).to.be.lessThan(
      second.indexOf('./Profile/tests.js')
    );
    expect(second.indexOf('./Profile/tests.js')).to.be.lessThan(
      second.indexOf('./Session/tests.js')
    );
    for (const name of [ 'Article', 'Profile', 'Session' ]) {
      expect(second).to.contain(`runAll${name}Tests(engine);`);
    }
  });

  it('should generate an empty runner when a model has no tests', () => {
    const project = createProject();
    const directory = project.createDirectory('/client');
    const model = Array.from(createSchema().models.values())[0];

    generateModelTests(directory, model);
    const source = project
      .getSourceFileOrThrow('/client/Profile/tests.ts')
      .getFullText();

    expect(source).to.contain('function runAllProfileTests(engine?: any)');
    expect(source).to.not.match(/^import /m);
  });

  it('should generate observable runtime tests without empty cases', () => {
    const project = createProject();
    const directory = project.createDirectory('/client');
    const model = Array.from(createSchema().models.values())[0];

    generateStoreTests(directory, model);
    generateActionsTests(directory, model);
    generateEventsTests(directory, model);

    const sources = [
      '/client/Profile/tests/ProfileStore.test.ts',
      '/client/Profile/tests/ProfileActions.test.ts',
      '/client/Profile/tests/events.test.ts'
    ].map(filepath => project.getSourceFileOrThrow(filepath).getFullText());
    for (const source of sources) {
      expect(source).to.not.contain('async () => {}');
      expect(source).to.contain('expect(');
    }
    expect(sources[0]).to.contain("expect(store.table).to.equal('profile')");
    expect(sources[1]).to.contain('expect(actions.engine).to.equal(database)');
    expect(sources[2]).to.contain('listen(emitter)');
  });
});
