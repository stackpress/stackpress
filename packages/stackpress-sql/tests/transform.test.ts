//modules
import { IndentationText, Project } from 'ts-morph';
import { describe, it } from 'mocha';
import { expect } from 'chai';
//stackpress-schema
import Schema from 'stackpress-schema/Schema';
//stackpress-sql
import { generateModelTests } from '../src/transform/tests.js';

describe('sql/transform/tests', () => {
  it('should incrementally add sql tests to a model aggregator', () => {
    const project = new Project({
      useInMemoryFileSystem: true,
      manipulationSettings: {
        indentationText: IndentationText.TwoSpaces
      }
    });
    const directory = project.createDirectory('/client');
    const schema = Schema.make({
      model: {
        Profile: {
          name: 'Profile',
          mutable: true,
          attributes: {},
          columns: []
        }
      }
    });
    const model = Array.from(schema.models.values())[0];

    //Start with the model aggregator shape produced by stackpress-schema.
    directory.createSourceFile('Profile/tests.ts', `
      import ProfileSchemaTests from './tests/ProfileSchema.test.js';

      type TestRunner = (engine?: any) => void;

      function runTestRunner(testRunner: TestRunner, engine: any) {
        testRunner(engine);
      }

      export default function runAllProfileTests(engine: any) {
        runTestRunner(
          ProfileSchemaTests as unknown as TestRunner,
          engine
        );
      }
    `);

    //Apply SQL twice to prove incremental generation stays idempotent.
    generateModelTests(directory, model);
    generateModelTests(directory, model);

    const source = project
      .getSourceFileOrThrow('/client/Profile/tests.ts')
      .getFullText();

    //SQL should add each owned test module exactly once.
    expect(source.match(/import ProfileStoreTests/g) || []).to.have.length(1);
    expect(source.match(/import ProfileActionTests/g) || []).to.have.length(1);
    expect(source.match(/import ProfileEventsTests/g) || []).to.have.length(1);
    expect(source.match(/ProfileSchemaTests as unknown/g) || []).to.have.length(1);
    expect(source.match(/ProfileStoreTests as unknown/g) || []).to.have.length(1);
    expect(source.match(/ProfileActionTests as unknown/g) || []).to.have.length(1);
    expect(source.match(/ProfileEventsTests as unknown/g) || []).to.have.length(1);
  });
});
