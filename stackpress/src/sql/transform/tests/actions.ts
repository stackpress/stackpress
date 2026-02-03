//modules
import type { Directory } from 'ts-morph';
//stackpress
import { renderCode } from '../../../helpers.js';
//stackpress/schema
import Schema from '../../../schema/Schema.js';
//stackpress/sql
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
          model: column.type.model!
        };
      });
    //populate inputs with sample data
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
      model.name.toPathName('%s/tests/actions.ts'),
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
    //import type Engine from '@stackpress/inquire/Engine';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/inquire/Engine',
      defaultImport: 'Engine'
    });
    for (const { model } of dependents.values()) {
      //import * as profileActions from '../../Profile/actions/index.js';
      source.addImportDeclaration({
        moduleSpecifier: model.name.toPathName('../../%s/actions/index.js'),
        namespaceImport: model.name.toMethodName('%sActions')
      });
    }
    //import { create, detail, ... } from '../actions/index.js';
    source.addImportDeclaration({
      moduleSpecifier: '../actions/index.js',
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
      name: model.name.toMethodName('%sActionTests', true),
      parameters: [{ name: 'engine', type: 'Engine' }],
      statements: renderCode(`
        describe('${model.name.titleCase} Actions', async () => {
          ${dependents.size > 0 ? renderCode(`
            const dependents: Record<string, any[]> = {};
            before(async () => {
              ${dependents.map(dependent => {
                const name = dependent.local.name;
                const actions = dependent.model.name.toMethodName('%sActions');
                return renderCode(`dependents.${name} = ((await ${actions}.search(engine)).results) || [];`);
              }).toArray().join('\n')}
            });
          `): ''}
          it('should create ${model.name.titleCase}', async () => {
            ${dependents.size > 0 
              ? renderCode(`
                const ids: Record<string, any> = {};
                ${dependents.map(dependent => {
                  const local = dependent.local.name;
                  const foreign = dependent.foreign.name;
                  return renderCode(`ids.${local} = dependents.${local}[0].${foreign};`);
                }).toArray().join('\n')}
                const input = Object.assign({}, ${JSON.stringify(inputs[0])}, ids);
              `)
              : renderCode(`const input = ${JSON.stringify(inputs[0])};`)
            }
            const actual = await create(engine, input);
            expect(actual.code).to.equal(200);
            expect(actual.status).to.equal('OK');
          });
          ${dependents.size < 2 ? renderCode(` 
            it('should batch ${model.name.titleCase}', async () => {
              const rows = ${JSON.stringify(inputs.slice(2))};
              ${dependents.map(dependent => {
                const local = dependent.local.name;
                const foreign = dependent.foreign.name;
                return renderCode(`
                  rows[0].${local} = dependents.${local}[2].${foreign};
                  rows[1].${local} = dependents.${local}[3].${foreign};
                `);
              }).toArray().join('\n')}
              const actual = await batch(engine, rows);
              expect(actual.code).to.equal(200);
              expect(actual.status).to.equal('OK');
            });
          `) : ''}
          it('should search ${model.name.titleCase}', async () => {
            const actual = await search(engine);
            expect(actual.code).to.equal(200);
            expect(actual.status).to.equal('OK');
            expect(Array.isArray(actual.results)).to.be.true;
          });
          ${model.store.ids.size > 0 ? renderCode(`
            it('should get ${model.name.titleCase}', async () => {
              const response = await search(engine);
              const row = response.results?.[0];

              const key = '${model.store.ids.toArray()[0].name.toString()}';
              const value = row?.[key] as string;

              const actual = await get(engine, key, value);
              expect(actual.code).to.equal(200);
              expect(actual.status).to.equal('OK');
            });
            it('should get ${model.name.titleCase} with ids', async () => {
              const response = await search(engine);
              const row = response.results?.[0];

              const ids: Record<string, string|number> = { ${
                model.store.ids.map(
                  column => renderCode(
                    `<%column%>: row?.<%column%> as string|number`,
                    { column: column.name.toString() }
                  )
                ).toArray().join(', ')
              } };

              const actual = await detail(engine, ids);
              expect(actual.code).to.equal(200);
              expect(actual.status).to.equal('OK');
            });
            it('should update ${model.name.titleCase}', async () => {
              const response = await search(engine);
              const row = response.results?.[0];

              const ids: Record<string, string|number> = { ${
                model.store.ids.map(
                  column => renderCode(
                    `<%column%>: row?.<%column%> as string|number`,
                    { column: column.name.toString() }
                  )
                ).toArray().join(', ')
              } };
              const input: Partial<Record<string, any>> = ${JSON.stringify(inputs[1])};
              Object.keys(ids).forEach(key => {
                delete input[key];
              });
              ${dependents.map(
                dependent => renderCode(`delete input.${dependent.local.name};`)
              ).toArray().join('\n')}

              const actual = await update(engine, ids, input);
              expect(actual.code).to.equal(200);
              expect(actual.status).to.equal('OK');
            });
            it('should remove ${model.name.titleCase}', async () => {
              const response = await search(engine);
              const row = response.results?.[0];

              const ids: Record<string, string|number> = { ${
                model.store.ids.map(
                  column => renderCode(
                    `<%column%>: row?.<%column%> as string|number`,
                    { column: column.name.toString() }
                  )
                ).toArray().join(', ')
              } };

              const actual = await remove(engine, ids);
              expect(actual.code).to.equal(200);
              expect(actual.status).to.equal('OK');
            });
            ${model.store.active ? renderCode(
              `it('should restore <%model%>', async () => {
                const response = await search(engine, { filter: { <%active%>: -1 } });
                const row = response.results?.[0];

                const ids: Record<string, string|number> = { <%ids%> };

                const actual = await restore(engine, ids);
                expect(actual.code).to.equal(200);
                expect(actual.status).to.equal('OK');
              });`,
              {
                model: model.name.titleCase,
                active: model.store.active.name.toString(),
                ids: model.store.ids.map(
                  column => renderCode(
                    `<%column%>: row?.<%column%> as string|number`,
                    { column: column.name.toString() }
                  )
                ).toArray().join(', ')
              }
            ) : ''}
          `): ''}
        });
      `)
    })
  }
};

export const TEMPLATE = {



};