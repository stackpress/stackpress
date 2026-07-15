//modules
import { IndentationText, Project } from 'ts-morph';
import { describe, it } from 'mocha';
import { expect } from 'chai';
//stackpress-schema
import Schema from 'stackpress-schema/Schema';
import generateSchemaModelTests from 'stackpress-schema/transform/tests';
//stackpress-sql
import generateModelTests from '../src/transform/tests/aggregate.js';
import generateRootTests from '../src/transform/tests/root.js';

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

describe('sql/transform/tests', () => {
  it('should extend schema-owned model runtime test aggregators', () => {
    const project = createProject();
    const directory = project.createDirectory('/client');
    const model = Array.from(createSchema().models.values())[0];

    generateSchemaModelTests(directory, model);
    generateModelTests(directory, model);
    const first = project
      .getSourceFileOrThrow('/client/Profile/tests.ts')
      .getFullText();
    generateModelTests(directory, model);
    const second = project
      .getSourceFileOrThrow('/client/Profile/tests.ts')
      .getFullText();

    expect(second).to.equal(first);
    expect(second.match(/^import /gm)).to.have.length(5);
    expect(second).to.contain('./tests/ProfileSchema.test.js');
    expect(second).to.contain('./tests/ProfileStore.test.js');
    expect(second).to.contain('./tests/columns/IdColumn.test.js');
    expect(second).to.contain('./tests/ProfileActions.test.js');
    expect(second).to.contain('./tests/events.test.js');
    expect(second.indexOf('ProfileSchema.test.js')).to.be.lessThan(
      second.indexOf('ProfileStore.test.js')
    );
    expect(second.match(/runTestRunner\(/g)).to.have.length(6);
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
    expect(second).to.contain('export function runAllTests');
    expect(second).to.contain('export default runAllTests');
  });

  it('should generate a SQL-only runner when schema has not contributed yet', () => {
    const project = createProject();
    const directory = project.createDirectory('/client');
    const model = Array.from(createSchema().models.values())[0];

    generateModelTests(directory, model);
    const source = project
      .getSourceFileOrThrow('/client/Profile/tests.ts')
      .getFullText();

    expect(source).to.contain('function runAllProfileTests(engine?: any)');
    expect(source.match(/^import /gm)).to.have.length(3);
    expect(source).to.contain('./tests/ProfileStore.test.js');
    expect(source).to.contain('./tests/ProfileActions.test.js');
    expect(source).to.contain('./tests/events.test.js');
  });

});
