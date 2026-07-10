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
import {
  generateSchemaModelTests,
  generateSqlModelTests,
  generateTestsIndex
} from '../src/transform/tests/aggregate.js';

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

describe('schema/transform/tests/aggregate', () => {
  it('should generate shared model and client test aggregators', async () => {
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
              name: 'name',
              type: 'String',
              required: true,
              multiple: false,
              attributes: {}
            }
          ]
        }
      }
    });
    const model = Array.from(schema.models.values())[0];

    //Generate the same files twice to prove this path is idempotent when
    //schema and sql both contribute to one tests.ts file incrementally.
    generateSchemaModelTests(directory, model);
    generateSqlModelTests(directory, model);
    generateSchemaModelTests(directory, model);
    generateSqlModelTests(directory, model);
    generateTestsIndex(directory, [ model ]);
    generateTestsIndex(directory, [ model ]);

    const modelSource = project
      .getSourceFileOrThrow('/client/Profile/tests.ts')
      .getFullText();
    const clientSource = project
      .getSourceFileOrThrow('/client/tests.ts')
      .getFullText();
    const sqlRunner = modelSource.slice(
      modelSource.indexOf('export function runSqlTests')
    );

    //The model entrypoint should import every generated test module once.
    expect(modelSource.match(/import IdColumnTests/g) || []).to.have.length(1);
    expect(modelSource.match(/import NameColumnTests/g) || []).to.have.length(1);
    expect(modelSource).to.match(
      /import ProfileSchemaTests from ['"]\.\/tests\/ProfileSchema\.test\.js['"];/
    );
    expect(modelSource).to.match(
      /import ProfileStoreTests from ['"]\.\/tests\/ProfileStore\.test\.js['"];/
    );
    expect(modelSource).to.match(
      /import ProfileActionTests from ['"]\.\/tests\/ProfileActions\.test\.js['"];/
    );
    expect(modelSource).to.match(
      /import ProfileEventsTests from ['"]\.\/tests\/events\.test\.js['"];/
    );

    //Schema owns schema and column runners; sql owns store/action/event runners.
    expect(modelSource).to.contain('runSchemaTests(engine);');
    expect(modelSource).to.contain('runSqlTests(engine);');
    expect(sqlRunner).to.contain('ProfileStoreTests');
    expect(sqlRunner).to.contain('ProfileActionTests');
    expect(sqlRunner).to.contain('ProfileEventsTests');
    expect(sqlRunner).to.not.contain('IdColumnTests');
    expect(sqlRunner).to.not.contain('NameColumnTests');

    //The top-level entrypoint should only delegate to each model entrypoint.
    expect(clientSource.match(/import ProfileTests/g) || []).to.have.length(1);
    expect(clientSource).to.match(
      /import ProfileTests from ['"]\.\/Profile\/tests\.js['"];/
    );
    expect(clientSource).to.contain('ProfileTests(engine);');
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
