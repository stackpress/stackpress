//node
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
//tests
import { describe, it } from 'mocha';
import { expect } from 'chai';
//stackpress-schema
import Schema from 'stackpress-schema/Schema';
//src
import {
  formatAmbiguousRenameMessage,
  planColumnRenames
} from '../src/helpers.js';
import migrate from '../src/scripts/migrate.js';
import upgrade from '../src/scripts/upgrade.js';

describe('sql/rename-plan/messages', () => {
  it('should flag same-shape removed and added fields as planned renames', () => {
    const from = Schema.make(makeSchemaConfig('summary'));
    const to = Schema.make(makeSchemaConfig('seoSummary'));

    expect(planColumnRenames(from, to).renames).to.deep.equal([{
      model: 'Article',
      table: 'article',
      from: 'summary',
      fromField: 'summary',
      to: 'seoSummary',
      toField: 'seo_summary'
    }]);
  });

  it('should ignore add and remove pairs with different SQL shapes', () => {
    const from = Schema.make(makeSchemaConfig('summary', {
      type: 'String',
      required: false
    }));
    const to = Schema.make(makeSchemaConfig('seoSummary', {
      type: 'Text',
      required: false
    }));

    expect(planColumnRenames(from, to).renames).to.deep.equal([]);
  });

  it('should ignore same-name field changes because they are not renames', () => {
    const from = Schema.make(makeSchemaConfig('summary', {
      type: 'String',
      required: false
    }));
    const to = Schema.make(makeSchemaConfig('summary', {
      type: 'Text',
      required: false
    }));

    expect(planColumnRenames(from, to).renames).to.deep.equal([]);
  });

  it('should flag foreign-key renames when only the local column changes', () => {
    const from = Schema.make(makeRelationSchemaConfig('profileId'));
    const to = Schema.make(makeRelationSchemaConfig('authorId'));

    expect(planColumnRenames(from, to).renames).to.deep.equal([{
      model: 'Article',
      table: 'article',
      from: 'profileId',
      fromField: 'profile_id',
      to: 'authorId',
      toField: 'author_id'
    }]);
  });

  it('should format a clear ambiguity message for terminal output', () => {
    const message = formatAmbiguousRenameMessage([{
      model: 'Article',
      table: 'article',
      fromFields: [ 'summary', 'teaser' ],
      toFields: [ 'seo_summary', 'seo_teaser' ]
    }]);

    expect(message).to.include('Ambiguous field rename detected.');
    expect(message).to.include('Article');
    expect(message).to.include('summary');
    expect(message).to.include('seo_summary');
  });
});

describe('sql/upgrade', () => {
  it('should execute a rename query for a clear one-to-one rename', async () => {
    const root = await makeRevisionPair(
      makeSchemaConfig('summary'),
      makeSchemaConfig('seoSummary')
    );
    const executed: string[] = [];
    let diffCalled = false;

    try {
      await upgrade(
        makeServer(root) as any,
        {
          diff(previous: { build(): { fields: Record<string, unknown> } }) {
            diffCalled = true;
            const fields = Object.keys(previous.build().fields);
            return {
              query() {
                return fields.includes('seo_summary')
                  ? []
                  : [{ query: 'ALTER TABLE "article" DROP COLUMN "summary"' }];
              }
            };
          },
          dialect: new PgsqlDialect(),
          async transaction(callback: (connection: {
            query(query: { query: string }): Promise<void>
          }) => Promise<void>) {
            await callback({
              async query(query: { query: string }) {
                executed.push(query.query);
              }
            });
          }
        } as any,
        {
          force: false,
          control: {
            error() {},
            info() {}
          }
        } as any
      );

      expect(diffCalled).to.equal(true);
      expect(executed).to.deep.equal([
        'ALTER TABLE "article" RENAME COLUMN "summary" TO "seo_summary"'
      ]);
    } finally {
      await fsp.rm(root, { recursive: true, force: true });
    }
  });

  it('should refuse ambiguous rename candidates before running SQL', async () => {
    const root = await makeRevisionPair(
      makeAmbiguousSchemaConfig([ 'summary', 'teaser' ]),
      makeAmbiguousSchemaConfig([ 'seoSummary', 'seoTeaser' ])
    );
    const messages: string[] = [];
    let diffCalled = false;
    let transactionCalled = false;

    try {
      await upgrade(
        makeServer(root) as any,
        {
          diff() {
            diffCalled = true;
            return { query: () => [] };
          },
          dialect: new PgsqlDialect(),
          async transaction() {
            transactionCalled = true;
          }
        } as any,
        {
          force: false,
          control: {
            error(message: string) {
              messages.push(message);
            }
          }
        } as any
      );
      throw new Error('Expected upgrade to throw on an ambiguous rename.');
    } catch (error) {
      expect((error as Error).message).to.include('Ambiguous field rename detected.');
      expect(messages[0]).to.include('summary');
      expect(diffCalled).to.equal(false);
      expect(transactionCalled).to.equal(false);
    } finally {
      await fsp.rm(root, { recursive: true, force: true });
    }
  });

  it('should still allow destructive changes when force is enabled', async () => {
    const root = await makeRevisionPair(
      makeSchemaConfig('summary'),
      makeSchemaConfig('seoSummary', { type: 'Text' })
    );
    const executed: string[] = [];
    let diffCalled = false;

    try {
      await upgrade(
        makeServer(root) as any,
        {
          diff() {
            diffCalled = true;
            return {
              query() {
                return [{ query: 'ALTER TABLE "article" DROP COLUMN "summary"' }];
              }
            };
          },
          dialect: new PgsqlDialect(),
          async transaction(callback: (connection: {
            query(query: { query: string }): Promise<void>
          }) => Promise<void>) {
            await callback({
              async query(query: { query: string }) {
                executed.push(query.query);
              }
            });
          }
        } as any,
        {
          force: true,
          verbose: true,
          control: {
            info() {},
            error() {}
          }
        } as any
      );

      expect(diffCalled).to.equal(true);
      expect(executed).to.deep.equal([
        'ALTER TABLE "article" DROP COLUMN "summary"'
      ]);
    } finally {
      await fsp.rm(root, { recursive: true, force: true });
    }
  });
});

describe('sql/migrate', () => {
  it('should write rename SQL into generated migration files', async () => {
    const root = await makeRevisionPair(
      makeSchemaConfig('summary'),
      makeSchemaConfig('seoSummary')
    );
    const migrations = await fsp.mkdtemp(path.join(os.tmpdir(), 'stackpress-migrations-'));

    try {
      await migrate(
        makeServer(root, migrations) as any,
        {
          diff(previous: { build(): { fields: Record<string, unknown> } }) {
            const fields = Object.keys(previous.build().fields);
            return {
              query() {
                return fields.includes('seo_summary')
                  ? []
                  : [{ query: 'ALTER TABLE "article" DROP COLUMN "summary"' }];
              }
            };
          },
          dialect: new PgsqlDialect()
        } as any,
        {
          control: {
            error() {},
            success() {},
            system() {}
          }
        } as any
      );

      const output = await fsp.readFile(path.join(migrations, '2000.sql'), 'utf8');

      expect(output).to.include(
        'ALTER TABLE "article" RENAME COLUMN "summary" TO "seo_summary"'
      );
      expect(output).to.not.include('DROP COLUMN "summary"');
    } finally {
      await fsp.rm(root, { recursive: true, force: true });
      await fsp.rm(migrations, { recursive: true, force: true });
    }
  });

  it('should refuse to write destructive migration files for ambiguous renames', async () => {
    const root = await makeRevisionPair(
      makeAmbiguousSchemaConfig([ 'summary', 'teaser' ]),
      makeAmbiguousSchemaConfig([ 'seoSummary', 'seoTeaser' ])
    );
    const migrations = await fsp.mkdtemp(path.join(os.tmpdir(), 'stackpress-migrations-'));

    try {
      await migrate(
        makeServer(root, migrations) as any,
        {
          diff() {
            return { query: () => [] };
          },
          dialect: new PgsqlDialect()
        } as any,
        {
          control: {
            error() {},
            success() {},
            system() {}
          }
        } as any
      );
      throw new Error('Expected migrate to throw on an ambiguous rename.');
    } catch (error) {
      expect((error as Error).message).to.include('Ambiguous field rename detected.');
      expect(fs.existsSync(path.join(migrations, '2000.sql'))).to.equal(false);
    } finally {
      await fsp.rm(root, { recursive: true, force: true });
      await fsp.rm(migrations, { recursive: true, force: true });
    }
  });
});

function makeServer(revisions: string, migrations?: string) {
  const config = Object.assign(((key: string) => {
    if (key === 'client') {
      return { revisions };
    }
    if (key === 'database') {
      return { migrations };
    }
    return null;
  }) as any, {
    path(key: string) {
      return key === 'client.revisions' ? revisions : null;
    }
  });
  return {
    config,
    loader: {
      fs: {
        exists(filepath: string) {
          return Promise.resolve(fs.existsSync(filepath));
        },
        mkdir(filepath: string, options?: { recursive?: boolean }) {
          return fsp.mkdir(filepath, options);
        },
        writeFile(filepath: string, contents: string) {
          return fsp.writeFile(filepath, contents);
        }
      },
      import(filepath: string) {
        return fsp.readFile(filepath, 'utf8').then(JSON.parse);
      }
    }
  };
}

async function makeRevisionPair(from: Record<string, any>, to: Record<string, any>) {
  const root = await fsp.mkdtemp(path.join(os.tmpdir(), 'stackpress-upgrade-'));
  await fsp.writeFile(path.join(root, '1000.json'), JSON.stringify(from, null, 2));
  await fsp.writeFile(path.join(root, '2000.json'), JSON.stringify(to, null, 2));
  return root;
}

function makeSchemaConfig(
  columnName: string,
  options: {
    type?: string,
    required?: boolean
  } = {}
) {
  return {
    model: {
      Article: {
        name: 'Article',
        mutable: true,
        attributes: {},
        columns: [
          {
            name: columnName,
            type: options.type || 'String',
            required: options.required ?? false,
            multiple: false,
            attributes: {
              label: [ 'Summary' ]
            }
          }
        ]
      }
    }
  };
}

function makeAmbiguousSchemaConfig(columnNames: string[]) {
  return {
    model: {
      Article: {
        name: 'Article',
        mutable: true,
        attributes: {},
        columns: columnNames.map(name => ({
          name,
          type: 'String',
          required: false,
          multiple: false,
          attributes: {
            label: [ 'Summary' ]
          }
        }))
      }
    }
  };
}

function makeRelationSchemaConfig(localColumnName: string) {
  return {
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
            attributes: {
              id: true
            }
          },
          {
            name: 'articles',
            type: 'Article',
            required: false,
            multiple: true,
            attributes: {}
          }
        ]
      },
      Article: {
        name: 'Article',
        mutable: true,
        attributes: {},
        columns: [
          {
            name: localColumnName,
            type: 'String',
            required: false,
            multiple: false,
            attributes: {}
          },
          {
            name: 'profile',
            type: 'Profile',
            required: false,
            multiple: false,
            attributes: {
              relation: [{
                local: localColumnName,
                foreign: 'id'
              }]
            }
          }
        ]
      }
    }
  };
}

class PgsqlDialect {
  create(schema: { build(): { table: string } }) {
    return [{ query: `CREATE TABLE "${schema.build().table}"` }];
  }

  drop(table: string) {
    return { query: `DROP TABLE "${table}"` };
  }
}
