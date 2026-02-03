//modules
import type { Directory } from 'ts-morph';
//schema
import Schema from '../../../schema/Schema.js';
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

export default function generate(directory: Directory, schema: Schema) {
  const models = schema.models.toArray();
  const order = sequence(models);
  //loop through models
  for (const model of order.reverse()) {
    //does any of the existing tables depend on this table?
    const dependents = model.store.foreignRelationships
      .filter(column => Boolean(column.type.model))
      .map(column => {
        const relation = column.store.foreignRelationship!;
        return {
          foreign: relation.foreign.key,
          local: relation.local.key,
          model: column.type.model
        };
      });
    const inputs = samples.map(sample => {
      const input: Record<string, unknown> = {};
      model.component.formFields.forEach(column => {
        const type = column.type.multiple
          ? 'array'
          : column.type.name === 'Json'
          ? 'object' 
          : column.type.name === 'Hash'
          ? 'object' 
          : column.type.name === 'Object'
          ? 'object' 
          : column.type.name === 'Number'
          ? 'number'
          : column.type.name === 'Boolean'
          ? 'boolean'
          : column.type.name === 'Date'
          ? 'date'
          : 'string';
        input[column.name.toString()] = sample[type];
      });
      return input;
    });
    const source = directory.createSourceFile(
      `${model.name.toString()}/tests/events.ts`,
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
      name: `${model.name.titleCase}EventTests`,
      parameters: [{ name: 'server', type: 'HttpServer' }],
      statements: (`
        describe('${model.name.titleCase} Events', async () => {
          before(async () => {
            await server.resolve('${model.name.lowerCase}-purge');
          });
          ${dependents.size > 0 ? (`
            const dependents: Record<string, any[]> = {};
            before(async () => {
              ${dependents.toArray().map(dependent => {
                const name = dependent.local.name.toString();
                const event = `'${dependent.model!.name.lowerCase}-search'`;
                return `dependents.${name} = ((await server.resolve(${event})).results as any[]) || [];`;
              }).join('\n')}
            });
          `): ''}
          it('should create ${model.name.titleCase}', async () => {
            ${dependents.size > 0 
              ? (`
                const ids: Record<string, any> = {};
                ${dependents.toArray().map(dependent => {
                  const local = dependent.local.name.toString();
                  const foreign = dependent.foreign.name.toString();
                  return `ids.${local} = dependents.${local}[0].${foreign};`;
                }).join('\n')}
                const input = Object.assign({}, ${JSON.stringify(inputs[0])}, ids);
              `)
              : `const input = ${JSON.stringify(inputs[0])};`
            }
            const actual = await server.resolve('${model.name.lowerCase}-create', input);
            expect(actual.code).to.equal(200);
            expect(actual.status).to.equal('OK');
          });
          ${dependents.size < 2 ? (` 
            it('should batch ${model.name.titleCase}', async () => {
              const rows = ${JSON.stringify(inputs.slice(2))};
              ${dependents.toArray().map(dependent => {
                const local = dependent.local.name.toString();
                const foreign = dependent.foreign.name.toString();
                return `
                  rows[0].${local} = dependents.${local}[2].${foreign};
                  rows[1].${local} = dependents.${local}[3].${foreign};
                `;
              }).join('\n')}
              const actual = await server.resolve('${model.name.lowerCase}-batch', { rows });
              expect(actual.code).to.equal(200);
              expect(actual.status).to.equal('OK');
            });
          `) : ''}
          it('should search ${model.name.titleCase}', async () => {
            const actual = await server.resolve('${model.name.lowerCase}-search');
            expect(actual.code).to.equal(200);
            expect(actual.status).to.equal('OK');
            expect(Array.isArray(actual.results)).to.be.true;
          });
          ${model.store.ids.size ? (`
            it('should get ${model.name.titleCase}', async () => {
              const response = await server.resolve('${model.name.lowerCase}-search');
              const row = response.results?.[0];

              const key = '${model.store.ids.toArray()[0].name}';
              const value = row[key];

              const actual = await server.resolve('${model.name.lowerCase}-get', { key, value });
              expect(actual.code).to.equal(200);
              expect(actual.status).to.equal('OK');
            });
            it('should get ${model.name.titleCase} with ids', async () => {
              const response = await server.resolve('${model.name.lowerCase}-search');
              const row = response.results?.[0];

              const ids = { ${
                model.store.ids.toArray().map(
                  column => `${column.name.toString()}: row.${column.name.toString()}`
                ).join(', ')
              } };

              const actual = await server.resolve('${model.name.lowerCase}-detail', ids);
              expect(actual.code).to.equal(200);
              expect(actual.status).to.equal('OK');
            });
            it('should update ${model.name.titleCase}', async () => {
              const response = await server.resolve('${model.name.lowerCase}-search');
              const row = response.results?.[0];

              const ids = { ${
                model.store.ids.toArray().map(
                  column => `${column.name.toString()}: row.${column.name.toString()}`
                ).join(', ')
              } };
              const input: Partial<Record<string, any>> = ${JSON.stringify(inputs[1])};
              Object.keys(ids).forEach(key => {
                delete input[key];
              });
              ${dependents.toArray().map(
                dependent => `delete input.${dependent.local.name};`
              ).join('\n')}

              const actual = await server.resolve(
                '${model.name.lowerCase}-update', 
                { ...ids, ...input }
              );
              expect(actual.code).to.equal(200);
              expect(actual.status).to.equal('OK');
            });
            it('should remove ${model.name.titleCase}', async () => {
              const response = await server.resolve('${model.name.lowerCase}-search');
              const row = response.results?.[0];

              const ids = { ${
                model.store.ids.toArray().map(
                  column => `${column.name.toString()}: row.${column.name.toString()}`
                ).join(', ')
              } };

              const actual = await server.resolve('${model.name.lowerCase}-remove', ids);
              expect(actual.code).to.equal(200);
              expect(actual.status).to.equal('OK');
            });
            ${model.store.active ? (`
              it('should restore ${model.name.titleCase}', async () => {
                const response = await server.resolve(
                  '${model.name.lowerCase}-search', 
                  { filter: { ${model.store.active.name}: -1 } }
                );
                const row = response.results?.[0];

                const ids = { ${
                  model.store.ids.toArray().map(
                    column => `${column.name.toString()}: row.${column.name.toString()}`
                  ).join(', ')
                } };

                const actual = await server.resolve('${model.name.lowerCase}-restore', ids);
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