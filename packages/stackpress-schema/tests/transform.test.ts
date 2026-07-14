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
import generateSchemaTests from '../src/transform/tests/schema.js';

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

  it('should generate observable schema runtime tests without empty cases', () => {
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

    const source = project
      .getSourceFileOrThrow('/client/Profile/tests/ProfileSchema.test.ts')
      .getFullText();
    expect(source).to.not.contain('async () => {}');
    expect(source).to.contain('schema.serialize');
    expect(source).to.contain('schema.unserialize');
    expect(source).to.contain("expect(actual).to.have.property('id')");
    expect(source).to.contain("expect(actual).to.have.property('tags')");
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
