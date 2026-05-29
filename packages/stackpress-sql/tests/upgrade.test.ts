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
  findLikelyRenameRisks,
  formatRenameRiskMessage
} from '../src/helpers.js';
import upgrade from '../src/scripts/upgrade.js';

describe('sql/rename-risk', () => {
  it('should flag same-shape removed and added fields as likely renames', () => {
    const from = Schema.make(makeSchemaConfig('summary'));
    const to = Schema.make(makeSchemaConfig('seoSummary'));

    expect(findLikelyRenameRisks(from, to)).to.deep.equal([{
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

    expect(findLikelyRenameRisks(from, to)).to.deep.equal([]);
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

    expect(findLikelyRenameRisks(from, to)).to.deep.equal([]);
  });

  it('should format a clear warning message for terminal output', () => {
    const message = formatRenameRiskMessage([{
      model: 'Article',
      table: 'article',
      from: 'summary',
      fromField: 'summary',
      to: 'seoSummary',
      toField: 'seo_summary'
    }]);

    expect(message).to.include('Potential destructive field rename detected.');
    expect(message).to.include('Article: summary (summary) -> seoSummary (seo_summary)');
    expect(message).to.include('--force');
  });
});

describe('sql/upgrade', () => {
  it('should refuse likely renames unless force is enabled', async () => {
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
            return { query: () => [] };
          },
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
      throw new Error('Expected upgrade to throw on a likely rename.');
    } catch (error) {
      expect((error as Error).message).to.include('Potential destructive field rename detected.');
      expect(messages[0]).to.include('summary');
      expect(diffCalled).to.equal(false);
      expect(transactionCalled).to.equal(false);
    } finally {
      await fsp.rm(root, { recursive: true, force: true });
    }
  });

  it('should allow the migration to continue when force is enabled', async () => {
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
          diff() {
            diffCalled = true;
            return {
              query() {
                return [{ query: 'ALTER TABLE "article" DROP COLUMN "summary"' }];
              }
            };
          },
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

function makeServer(revisions: string) {
  const config = ((key: string) => key === 'client' ? { revisions } : null) as any;
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
