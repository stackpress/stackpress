//modules
import type { Directory } from 'ts-morph';
//schema
import type Column from '../../../schema/spec/Column.js';
import type Model from '../../../schema/spec/Model.js';
import Registry from '../../../schema/Registry.js';
//sql
import { sequence } from '../../helpers.js';

const samples = [
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

export default function generate(directory: Directory, registry: Registry) {
  const models = Array.from(registry.model.values());
  const order = sequence(models);
  //loop through models
  for (const model of order.reverse()) {
    //does any of the existing tables depend on this table?
    const dependents = model.relations
      .filter(column => column.model)
      .map(column => ({
        foreign: column.relation?.parent.key as Column,
        local: column.relation?.child.key as Column,
        model: column.model as Model
      }));
    const inputs = samples.map(sample => {
      const input: Record<string, unknown> = {};
      model.fields.forEach(column => {
        const type = column.multiple
          ? 'array'
          : column.type === 'Json'
          ? 'object' 
          : column.type === 'Hash'
          ? 'object' 
          : column.type === 'Object'
          ? 'object' 
          : column.type === 'Number'
          ? 'number'
          : column.type === 'Boolean'
          ? 'boolean'
          : column.type === 'Date'
          ? 'date'
          : 'string';
        input[column.name] = sample[type];
      });
      return input;
    });
    const source = directory.createSourceFile(
      `${model.name}/tests/events.ts`,
      '', 
      { overwrite: true }
    );
    //import type { HttpServer } from '@stackpress/ingest';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/ingest',
      namedImports: [ 'HttpServer' ]
    });
    //import { describe, it } from 'mocha';
    source.addImportDeclaration({
      moduleSpecifier: 'mocha',
      namedImports: ['describe', 'it']
    });
    //import { expect } from 'chai';
    source.addImportDeclaration({
      moduleSpecifier: 'chai',
      namedImports: [ 'expect' ]
    });
    //export default function ProfileEventTests(emitter: EventEmitter) {}
    source.addFunction({
      isDefaultExport: true,
      name: `${model.title}EventTests`,
      parameters: [{ name: 'server', type: 'HttpServer' }],
      statements: (`
        describe('${model.title} Events', async () => {
          before(async () => {
            await server.resolve('${model.lower}-purge');
          });
          ${dependents.length > 0 ? (`
            const dependents: Record<string, any[]> = {};
            before(async () => {
              ${dependents.map(dependent => {
                const name = dependent.local.name;
                const event = `'${dependent.model.lower}-search'`;
                return `dependents.${name} = ((await server.resolve(${event})).results as any[]) || [];`;
              }).join('\n')}
            });
          `): ''}
          it('should create ${model.title}', async () => {
            ${dependents.length > 0 
              ? (`
                const ids: Record<string, any> = {};
                ${dependents.map(dependent => {
                  const local = dependent.local.name;
                  const foreign = dependent.foreign.name;
                  return `ids.${local} = dependents.${local}[0].${foreign};`;
                }).join('\n')}
                const input = Object.assign({}, ${JSON.stringify(inputs[0])}, ids);
              `)
              : `const input = ${JSON.stringify(inputs[0])};`
            }
            const actual = await server.resolve('${model.lower}-create', input);
            expect(actual.code).to.equal(200);
            expect(actual.status).to.equal('OK');
          });
          ${dependents.length < 2 ? (` 
            it('should batch ${model.title}', async () => {
              const rows = ${JSON.stringify(inputs.slice(2))};
              ${dependents.map(dependent => {
                const local = dependent.local.name;
                const foreign = dependent.foreign.name;
                return `
                  rows[0].${local} = dependents.${local}[2].${foreign};
                  rows[1].${local} = dependents.${local}[3].${foreign};
                `;
              }).join('\n')}
              const actual = await server.resolve('${model.lower}-batch', { rows });
              expect(actual.code).to.equal(200);
              expect(actual.status).to.equal('OK');
            });
          `) : ''}
          it('should search ${model.title}', async () => {
            const actual = await server.resolve('${model.lower}-search');
            expect(actual.code).to.equal(200);
            expect(actual.status).to.equal('OK');
            expect(Array.isArray(actual.results)).to.be.true;
          });
          ${model.ids.length ? (`
            it('should get ${model.title}', async () => {
              const response = await server.resolve('${model.lower}-search');
              const row = response.results?.[0];

              const key = '${model.ids[0].name}';
              const value = row[key];

              const actual = await server.resolve('${model.lower}-get', { key, value });
              expect(actual.code).to.equal(200);
              expect(actual.status).to.equal('OK');
            });
            it('should get ${model.title} with ids', async () => {
              const response = await server.resolve('${model.lower}-search');
              const row = response.results?.[0];

              const ids = { ${
                model.ids.map(column => `${column.name}: row.${column.name}`).join(', ')
              } };

              const actual = await server.resolve('${model.lower}-detail', ids);
              expect(actual.code).to.equal(200);
              expect(actual.status).to.equal('OK');
            });
            it('should update ${model.title}', async () => {
              const response = await server.resolve('${model.lower}-search');
              const row = response.results?.[0];

              const ids = { ${
                model.ids.map(column => `${column.name}: row.${column.name}`).join(', ')
              } };
              const input: Partial<Record<string, any>> = ${JSON.stringify(inputs[1])};
              Object.keys(ids).forEach(key => {
                delete input[key];
              });
              ${dependents.map(
                dependent => `delete input.${dependent.local.name};`
              ).join('\n')}

              const actual = await server.resolve(
                '${model.lower}-update', 
                { ...ids, ...input }
              );
              expect(actual.code).to.equal(200);
              expect(actual.status).to.equal('OK');
            });
            it('should remove ${model.title}', async () => {
              const response = await server.resolve('${model.lower}-search');
              const row = response.results?.[0];

              const ids = { ${
                model.ids.map(column => `${column.name}: row.${column.name}`).join(', ')
              } };

              const actual = await server.resolve('${model.lower}-remove', ids);
              expect(actual.code).to.equal(200);
              expect(actual.status).to.equal('OK');
            });
            ${model.active ? (`
              it('should restore ${model.title}', async () => {
                const response = await server.resolve(
                  '${model.lower}-search', 
                  { filter: { ${model.active.name}: -1 } }
                );
                const row = response.results?.[0];

                const ids = { ${
                  model.ids.map(column => `${column.name}: row.${column.name}`).join(', ')
                } };

                const actual = await server.resolve('${model.lower}-restore', ids);
                expect(actual.code).to.equal(200);
                expect(actual.status).to.equal('OK');
              });
            `) : ''}
          `): ''}
        });
      `)
    })
  }
};