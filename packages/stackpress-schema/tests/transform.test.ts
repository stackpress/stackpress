//node
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
//modules
import { IndentationText, Project } from 'ts-morph';
//tests
import { describe, it } from 'mocha';
import { expect } from 'chai';
//stackpress-schema
import Schema from '../src/Schema.js';
import { pruneGeneratedSchemaFiles } from '../src/transform/helpers.js';
import generatePackage from '../src/transform/package.js';
import generateSchemaTests from '../src/transform/tests/schema.js';
import {
  generateModelTests,
  generateTests
} from '../src/transform/tests.js';

describe('schema/transform/helpers', () => {
  it('should remove stale generated files left behind by renamed fields', async () => {
    const root = await fsp.mkdtemp(path.join(os.tmpdir(), 'stackpress-schema-'));
    const articleColumns = path.join(root, 'Article', 'columns');
    const articleTestColumns = path.join(root, 'Article', 'tests', 'columns');
    const profileColumns = path.join(root, 'Profile', 'columns');

    try {
      await fsp.mkdir(articleColumns, { recursive: true });
      await fsp.mkdir(articleTestColumns, { recursive: true });
      await fsp.mkdir(profileColumns, { recursive: true });
      await fsp.writeFile(path.join(articleColumns, 'SummaryColumn.ts'), '');
      await fsp.writeFile(path.join(articleColumns, 'SeoSummaryColumn.ts'), '');
      await fsp.writeFile(path.join(articleColumns, 'index.ts'), '');
      await fsp.writeFile(path.join(articleTestColumns, 'SummaryColumn.test.ts'), '');
      await fsp.writeFile(path.join(articleTestColumns, 'SeoSummaryColumn.test.ts'), '');
      await fsp.writeFile(path.join(profileColumns, 'NameColumn.ts'), '');

      const schema = Schema.make({
        model: {
          Article: {
            name: 'Article',
            mutable: true,
            attributes: {},
            columns: [
              {
                name: 'seoSummary',
                type: 'String',
                required: false,
                multiple: false,
                attributes: {}
              }
            ]
          }
        }
      });

      await pruneGeneratedSchemaFiles(root, schema);

      expect(await pathExists(path.join(articleColumns, 'SeoSummaryColumn.ts'))).to.equal(true);
      expect(await pathExists(path.join(articleColumns, 'SummaryColumn.ts'))).to.equal(false);
      expect(await pathExists(path.join(articleColumns, 'index.ts'))).to.equal(true);
      expect(await pathExists(path.join(articleTestColumns, 'SeoSummaryColumn.test.ts'))).to.equal(true);
      expect(await pathExists(path.join(articleTestColumns, 'SummaryColumn.test.ts'))).to.equal(false);
      expect(await pathExists(path.join(root, 'Profile'))).to.equal(false);
    } finally {
      await fsp.rm(root, { recursive: true, force: true });
    }
  });
});

describe('schema/transform/tests', () => {
  it('should generate shared model and client test aggregators', async () => {
    const project = new Project({
      useInMemoryFileSystem: true,
      manipulationSettings: {
        indentationText: IndentationText.TwoSpaces
      }
    });
    const directory = project.createDirectory('/client');
    const modelNames = [
      'Session',
      'Profile',
      'Comment',
      'Category',
      'Catalog',
      'Auth',
      'Article',
      'Application'
    ];
    const schema = Schema.make({
      model: Object.fromEntries(modelNames.map(name => [
        name,
        {
          name,
          mutable: true,
          attributes: {},
          columns: [
            {
              name: 'id',
              type: 'String',
              required: true,
              multiple: false,
              attributes: { id: true }
            },
            ...(name === 'Profile' ? [{
              name: 'name',
              type: 'String',
              required: true,
              multiple: false,
              attributes: {}
            }] : [])
          ]
        }
      ]))
    });
    const models = Array.from(schema.models.values());
    const model = models.find(
      model => model.name.toClassName() === 'Profile'
    )!;

    //Generate the same files twice to prove schema aggregation is idempotent.
    for (let pass = 0; pass < 2; pass++) {
      for (const model of models) {
        generateModelTests(directory, model);
      }
      generateTests(directory, schema);
    }

    const modelSource = project
      .getSourceFileOrThrow('/client/Profile/tests.ts')
      .getFullText();
    const clientSource = project
      .getSourceFileOrThrow('/client/tests.ts')
      .getFullText();
    //The model entrypoint should import every generated test module once.
    expect(modelSource.match(/import IdColumnTests/g) || []).to.have.length(1);
    expect(modelSource.match(/import NameColumnTests/g) || []).to.have.length(1);
    expect(modelSource).to.match(
      /import ProfileSchemaTests from ['"]\.\/tests\/ProfileSchema\.test\.js['"];/
    );

    //The model entrypoint should expose one runner for all schema tests.
    expect(modelSource).to.contain(
      'export default function runAllProfileTests'
    );
    expect(modelSource).to.contain('ProfileSchemaTests');
    expect(modelSource).to.contain('IdColumnTests');
    expect(modelSource).to.contain('NameColumnTests');

    //The top-level entrypoint should only delegate to each model entrypoint.
    expect(clientSource.match(/import runAllProfileTests/g) || []).to.have.length(1);
    expect(clientSource).to.match(
      /import runAllProfileTests from ['"]\.\/Profile\/tests\.js['"];/
    );
    expect(clientSource).to.contain('runAllProfileTests(engine);');
    expect(clientSource.indexOf('runAllApplicationTests')).to.be.lessThan(
      clientSource.indexOf('runAllSessionTests')
    );
    //Every blog model should expose and invoke its model runner.
    for (const name of modelNames) {
      expect(clientSource).to.contain(`runAll${name}Tests`);
      expect(clientSource).to.contain(`runAll${name}Tests(engine);`);
    }
    expect(clientSource).to.contain(
      'export default function runAllTests'
    );
  });

  it('should generate a deterministic empty root test aggregator', () => {
    const project = new Project({
      useInMemoryFileSystem: true,
      manipulationSettings: {
        indentationText: IndentationText.TwoSpaces
      }
    });
    const directory = project.createDirectory('/client');
    const schema = Schema.make({ model: {} });

    generateTests(directory, schema);
    generateTests(directory, schema);

    const source = project
      .getSourceFileOrThrow('/client/tests.ts')
      .getFullText();

    expect(source.match(/^import /gm) || []).to.have.length(0);
    expect(source).to.contain('export default function runAllTests');
  });

  it('should expose root and model test aggregators from the client package', async () => {
    const root = await fsp.mkdtemp(path.join(os.tmpdir(), 'stackpress-package-'));
    const project = new Project();

    try {
      await fsp.writeFile(path.join(root, 'package.json'), '{}');
      const directory = project.addDirectoryAtPath(root);
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

      generatePackage(directory, schema, 'blog-client');

      const packageJson = JSON.parse(
        await fsp.readFile(path.join(root, 'package.json'), 'utf8')
      );
      expect(packageJson.exports['./tests']).to.equal('./tests.js');
      expect(packageJson.exports['./Profile/tests']).to.equal(
        './Profile/tests.js'
      );
      expect(packageJson.typesVersions['*'].tests).to.deep.equal([
        './tests.d.ts'
      ]);
      expect(packageJson.typesVersions['*']['./Profile/tests']).to.deep.equal([
        './Profile/tests.d.ts'
      ]);
    } finally {
      await fsp.rm(root, { recursive: true, force: true });
    }
  });

  it('should generate runtime schema and column assertions', () => {
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
          columns: [
            {
              name: 'id',
              type: 'String',
              required: true,
              multiple: false,
              attributes: { id: true }
            },
            {
              name: 'tags',
              type: 'String',
              required: false,
              multiple: true,
              attributes: {}
            }
          ]
        }
      }
    });
    const model = Array.from(schema.models.values())[0];

    generateSchemaTests(directory, model);

    const schemaSource = project
      .getSourceFileOrThrow('/client/Profile/tests/ProfileSchema.test.ts')
      .getFullText();
    const columnSource = project
      .getSourceFileOrThrow('/client/Profile/tests/columns/TagsColumn.test.ts')
      .getFullText();
    expect(schemaSource).to.not.contain('async () => {}');
    expect(schemaSource).to.contain('schema.serialize');
    expect(schemaSource).to.contain('schema.unserialize');
    expect(columnSource).to.not.contain('engine: Engine');
    expect(columnSource).to.match(
      /expect\(column\.assert\(\[['"]foo['"], ['"]bar['"]\]\)\)\.to\.be\.null/
    );
  });
});

async function pathExists(filepath: string) {
  try {
    await fsp.stat(filepath);
    return true;
  } catch {
    return false;
  }
}
