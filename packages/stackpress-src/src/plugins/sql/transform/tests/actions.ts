//modules
import type { Directory } from 'ts-morph';
//schema
import type Column from '../../../../schema/spec/Column';
import type Model from '../../../../schema/spec/Model';
import Registry from '../../../../schema/Registry';
//sql
import { sequence } from '../../helpers';

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
      `${model.name}/tests/actions.ts`,
      '', 
      { overwrite: true }
    );
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
    //import type Engine from '@stackpress/inquire/dist/Engine';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/inquire/dist/Engine',
      defaultImport: 'Engine'
    });
    //import config from '../config';
    source.addImportDeclaration({
      moduleSpecifier: '../config',
      defaultImport: 'config'
    });
    for (const dependent of dependents) {
      //import * as profileActions from '../../profile/actions';
      source.addImportDeclaration({
        moduleSpecifier: `../../${dependent.model.name}/actions`,
        namespaceImport: `${dependent.model.camel}Actions`
      });
    }
    //import { create, detail, ... } from '../actions';
    source.addImportDeclaration({
      moduleSpecifier: '../actions',
      namedImports: [
        'batch',
        'create',
        'detail',
        'get',
        'remove',
        'restore',
        'search',
        'update',
        'upsert'
      ]
    });
    //export default function ProfileActionTests(engine: Engine) {}
    source.addFunction({
      isDefaultExport: true,
      name: `${model.title}ActionTests`,
      parameters: [{ name: 'engine', type: 'Engine' }],
      statements: (`
        describe('${model.title} Actions', async () => {
          ${dependents.length > 0 ? (`
            const dependents: Record<string, any[]> = {};
            before(async () => {
              ${dependents.map(dependent => {
                const name = dependent.local.name;
                const actions = `${dependent.model.camel}Actions`;
                return `dependents.${name} = ((await ${actions}.search(engine)).results) || [];`;
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
            const actual = await create(engine, input);
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
              const actual = await batch(engine, rows);
              expect(actual.code).to.equal(200);
              expect(actual.status).to.equal('OK');
            });
          `) : ''}
          it('should search ${model.title}', async () => {
            const actual = await search(engine);
            expect(actual.code).to.equal(200);
            expect(actual.status).to.equal('OK');
            expect(Array.isArray(actual.results)).to.be.true;
          });
          ${model.ids.length ? (`
            it('should get ${model.title}', async () => {
              const response = await search(engine);
              const row = response.results[0];

              const key = '${model.ids[0].name}';
              const value = row[key];

              const actual = await get(engine, key, value);
              expect(actual.code).to.equal(200);
              expect(actual.status).to.equal('OK');
            });
            it('should get ${model.title} with ids', async () => {
              const response = await search(engine);
              const row = response.results[0];

              const ids = { ${
                model.ids.map(column => `${column.name}: row.${column.name}`).join(', ')
              } };

              const actual = await detail(engine, ids);
              expect(actual.code).to.equal(200);
              expect(actual.status).to.equal('OK');
            });
            it('should update ${model.title}', async () => {
              const response = await search(engine);
              const row = response.results[0];

              const ids = { ${
                model.ids.map(column => `${column.name}: row.${column.name}`).join(', ')
              } };
              const input = ${JSON.stringify(inputs[1])};
              Object.keys(ids).forEach(key => {
                delete input[key];
              });
              ${dependents.map(
                dependent => `delete input.${dependent.local.name};`
              ).join('\n')}

              const actual = await update(engine, ids, input);
              expect(actual.code).to.equal(200);
              expect(actual.status).to.equal('OK');
            });
            it('should remove ${model.title}', async () => {
              const response = await search(engine);
              const row = response.results[0];

              const ids = { ${
                model.ids.map(column => `${column.name}: row.${column.name}`).join(', ')
              } };

              const actual = await remove(engine, ids);
              expect(actual.code).to.equal(200);
              expect(actual.status).to.equal('OK');
            });
            ${model.active ? (`
              it('should restore ${model.title}', async () => {
                const response = await search(engine, { filter: { ${model.active.name}: -1 } });
                const row = response.results[0];

                const ids = { ${
                  model.ids.map(column => `${column.name}: row.${column.name}`).join(', ')
                } };

                const actual = await restore(engine, ids);
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