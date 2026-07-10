//node
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
//tests
import { describe, it } from 'mocha';
import { expect } from 'chai';
//src
import migrate from '../src/scripts/migrate.js';
import upgrade from '../src/scripts/upgrade.js';

describe('sql/upgrade', () => {
  it('should refuse destructive field removals when force is false', async () => {
    const root = await makeRevisionPair(
      makeSchemaConfig('summary'),
      makeSchemaConfig('seoSummary')
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
            return {
              build() {
                return makeDestructiveAlterBuild({ fields: [ 'summary' ] });
              },
              query() {
                return [{ query: 'ALTER TABLE "article" DROP COLUMN "summary"' }];
              }
            };
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
            },
            info() {}
          }
        } as any
      );
      throw new Error('Expected upgrade to throw on a destructive alter.');
    } catch (error) {
      expect((error as Error).message).to.include(
        'Destructive schema changes detected.'
      );
      expect(messages[0]).to.include('Removed fields: summary');
      expect(diffCalled).to.equal(true);
      expect(transactionCalled).to.equal(false);
    } finally {
      await fsp.rm(root, { recursive: true, force: true });
    }
  });

  it('should execute destructive alter SQL when force is enabled', async () => {
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
              build() {
                return makeDestructiveAlterBuild({ fields: [ 'summary' ] });
              },
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

  it('should refuse dropped tables when force is false', async () => {
    const root = await makeRevisionPair(
      makeSchemaConfig('summary'),
      { model: {} }
    );
    const messages: string[] = [];

    try {
      await upgrade(
        makeServer(root) as any,
        {
          diff() {
            throw new Error('diff should not run for dropped tables only');
          },
          dialect: new PgsqlDialect(),
          async transaction() {
            throw new Error('transaction should not run');
          }
        } as any,
        {
          force: false,
          control: {
            error(message: string) {
              messages.push(message);
            },
            info() {}
          }
        } as any
      );
      throw new Error('Expected upgrade to throw on a dropped table.');
    } catch (error) {
      expect((error as Error).message).to.include(
        'Destructive schema changes detected.'
      );
      expect(messages[0]).to.include('Dropped tables: article');
    } finally {
      await fsp.rm(root, { recursive: true, force: true });
    }
  });

  it('should report all destructive changes in one warning', async () => {
    const root = await makeRevisionPair(
      makeSchemaConfig('summary', {
        extraModels: [ makeModelConfig('Comment', 'body') ]
      }),
      makeSchemaConfig('seoSummary')
    );
    const messages: string[] = [];

    try {
      await upgrade(
        makeServer(root) as any,
        {
          diff() {
            return {
              build() {
                return makeDestructiveAlterBuild({
                  fields: [ 'summary', 'published' ],
                  foreign: [ 'article_author_id_foreign' ]
                });
              },
              query() {
                return [{ query: 'ALTER TABLE "article" DROP COLUMN "summary"' }];
              }
            };
          },
          dialect: new PgsqlDialect(),
          async transaction() {
            throw new Error('transaction should not run');
          }
        } as any,
        {
          force: false,
          control: {
            error(message: string) {
              messages.push(message);
            },
            info() {}
          }
        } as any
      );
      throw new Error('Expected upgrade to throw on destructive changes.');
    } catch (error) {
      expect((error as Error).message).to.include(
        'Destructive schema changes detected.'
      );
      expect(messages[0]).to.include('Table "article":');
      expect(messages[0]).to.include('Removed fields: summary, published');
      expect(messages[0]).to.include(
        'Removed foreign keys: article_author_id_foreign'
      );
      expect(messages[0]).to.include('Dropped tables: comment');
    } finally {
      await fsp.rm(root, { recursive: true, force: true });
    }
  });
});

describe('sql/migrate', () => {
  it('should refuse to write migration files for destructive field removals when force is false', async () => {
    const root = await makeRevisionPair(
      makeSchemaConfig('summary'),
      makeSchemaConfig('seoSummary')
    );
    const migrations = await fsp.mkdtemp(path.join(os.tmpdir(), 'stackpress-migrations-'));
    const messages: string[] = [];

    try {
      await migrate(
        makeServer(root, migrations) as any,
        {
          diff() {
            return {
              build() {
                return makeDestructiveAlterBuild({ fields: [ 'summary' ] });
              },
              query() {
                return [{ query: 'ALTER TABLE "article" DROP COLUMN "summary"' }];
              }
            };
          },
          dialect: new PgsqlDialect()
        } as any,
        {
          force: false,
          control: {
            error(message: string) {
              messages.push(message);
            },
            success() {},
            system() {}
          }
        } as any
      );
      throw new Error('Expected migrate to throw on a destructive alter.');
    } catch (error) {
      expect((error as Error).message).to.include(
        'Destructive schema changes detected.'
      );
      expect(messages[0]).to.include('Removed fields: summary');
      expect(fs.existsSync(path.join(migrations, '2000.sql'))).to.equal(false);
    } finally {
      await fsp.rm(root, { recursive: true, force: true });
      await fsp.rm(migrations, { recursive: true, force: true });
    }
  });

  it('should write destructive alter SQL when force is enabled', async () => {
    const root = await makeRevisionPair(
      makeSchemaConfig('summary'),
      makeSchemaConfig('seoSummary')
    );
    const migrations = await fsp.mkdtemp(path.join(os.tmpdir(), 'stackpress-migrations-'));

    try {
      await migrate(
        makeServer(root, migrations) as any,
        {
          diff() {
            return {
              build() {
                return makeDestructiveAlterBuild({ fields: [ 'summary' ] });
              },
              query() {
                return [{ query: 'ALTER TABLE "article" DROP COLUMN "summary"' }];
              }
            };
          },
          dialect: new PgsqlDialect()
        } as any,
        {
          force: true,
          control: {
            error() {},
            success() {},
            system() {}
          }
        } as any
      );

      const output = await fsp.readFile(path.join(migrations, '2000.sql'), 'utf8');

      expect(output).to.include('ALTER TABLE "article" DROP COLUMN "summary"');
    } finally {
      await fsp.rm(root, { recursive: true, force: true });
      await fsp.rm(migrations, { recursive: true, force: true });
    }
  });
});

function makeDestructiveAlterBuild(removals: {
  fields?: string[],
  primary?: string[],
  unique?: string[],
  keys?: string[],
  foreign?: string[]
}) {
  return {
    fields: { remove: removals.fields || [] },
    primary: { remove: removals.primary || [] },
    unique: { remove: removals.unique || [] },
    keys: { remove: removals.keys || [] },
    foreign: { remove: removals.foreign || [] }
  };
}

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
    required?: boolean,
    extraModels?: Array<ReturnType<typeof makeModelConfig>>
  } = {}
) {
  return {
    model: {
      Article: makeModelConfig('Article', columnName, options),
      ...Object.fromEntries(
        (options.extraModels || []).map(model => [ model.name, model ])
      )
    }
  };
}

function makeModelConfig(
  name: string,
  columnName: string,
  options: {
    type?: string,
    required?: boolean
  } = {}
) {
  return {
    name,
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
  };
}

class PgsqlDialect {
  public create(builder: { build(): { table: string } }) {
    return [{
      query: `CREATE TABLE IF NOT EXISTS "${builder.build().table}" ()`
    }];
  }

  public drop(table: string) {
    return {
      query: `DROP TABLE "${table}"`
    };
  }
}
