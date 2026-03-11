//modules
import type { Directory } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress/schema
import type Model from '../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../schema/transform/helpers.js';

//these are possible column types to map what formatter (below) to use
export const strings = [ 'String', 'Text' ];
export const numbers = [ 'Number', 'Float', 'Integer' ];
export const dates = [ 'Date', 'Time', 'Datetime' ];
export const objects = [ 'Object', 'Json', 'Hash' ];

const typemap: Record<string, string> = {
  String: 'string',
  Text: 'string',
  Number: 'number',
  Integer: 'number',
  Float: 'number',
  Date: 'Date',
  Time: 'Date',
  Datetime: 'Date',
  Json: 'Record<string, ScalarInput>',
  Object: 'Record<string, ScalarInput>',
  Hash: 'Record<string, ScalarInput>'
};

export default function generate(directory: Directory, model: Model) {
  const ids = model.store.ids.filter(
    column => column.type.name in typemap
  );

  const filepath = model.name.toPathName('%s/%sActions.ts');
  //load Profile/index.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //import type { ScalarInput } from '@stackpress/lib/types';
  if (ids.findValue(column => objects.includes(column.type.name))) {
    source.addImportDeclaration({
      namedImports: [ 'ScalarInput' ],
      moduleSpecifier: '@stackpress/lib/types'
    });
  }
  //import type Engine from '@stackpress/inquire/Engine';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/inquire/Engine',
    defaultImport: 'Engine'
  });
  //import type { StatusResponse } from '@stackpress/lib/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/lib/types',
    namedImports: [ 'StatusResponse' ]
  });
  //import type { StoreSelectFilters } from 'stackpress/sql/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/sql/types',
    namedImports: [ 'StoreSelectFilters' ]
  });
  //import Exception from 'stackpress/Exception';
  source.addImportDeclaration({
    defaultImport: 'Exception',
    moduleSpecifier: 'stackpress/Exception'
  });
  //import AbstractActions from 'stackpress/sql/AbstractActions';
  source.addImportDeclaration({
    defaultImport: 'AbstractActions',
    moduleSpecifier: 'stackpress/sql/AbstractActions'
  });
  //import type { Profile, ProfileExtended, ProfileInput, ProfileActionsInterface } from './types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: './types.js',
    namedImports: [ 
      model.name.toTypeName(),
      model.name.toTypeName('%sExtended'),
      model.name.toTypeName('%sInput'),
      model.name.toClassName('%sActionsInterface')
    ]
  });
  //import ProfileStore from './ProfileStore.js';
  source.addImportDeclaration({
    moduleSpecifier: model.name.toPathName('./%sStore.js'),
    defaultImport: model.name.toClassName('%sStore')
  });
  
  //export default class ProfileActions {};
  const definition = source.addClass({
    name: model.name.toClassName('%sActions'),
    //extends AbstractActions<Place, PlaceExtended, PlaceInput>
    extends: model.name.toTypeName('AbstractActions<%s, %sExtended, %sInput>'),
    //implements ActionsInterface<Place, PlaceExtended, PlaceInput> 
    implements: [ model.name.toClassName('%sActionsInterface') ],
    isDefaultExport: true,
  });
  //public readonly store;
  definition.addProperty({
    scope: Scope.Public,
    isReadonly: true,
    name: 'store'
  });
  //public constructor(engine: Engine, seed = '') {}
  definition.addConstructor({
    scope: Scope.Public,
    parameters: [{
      name: 'engine',
      type: 'Engine'
    }, {
      name: 'seed',
      initializer: "''"
    }],
    statements: renderCode(TEMPLATE.CONSTRUCTOR, {
      store: model.name.toClassName('%sStore')
    })
  });
  //public async batch(inputs: Array<ProfileInput>, mode = 'upsert') {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'batch',
    parameters: [{
      name: 'inputs',
      type: model.name.toTypeName('Array<%sInput>')
    }, {
      name: 'mode',
      type: `'create' | 'update' | 'upsert'`,
      initializer: `'upsert'`
    }],
    statements: renderCode(TEMPLATE.BATCH, {
      type: model.name.toTypeName(),
      store: model.name.toClassName('%sStore'),
      uniques: model.store.uniques.map(
        column => ({ column: column.name.toString() })
      ).toArray()
    })
  });
  //public async create(input: ProfileInput) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'create',
    parameters: [{
      name: 'input',
      type: model.name.toTypeName('%sInput')
    }],
    statements: renderCode(TEMPLATE.CREATE, {
      oneid: ids.size === 1,
      multid: ids.size > 1,
      noid: ids.size === 0,
      type: ids.size === 1 
        ? ids.map(column => typemap[column.type.name]!).toArray()[0] 
        : 'any',
      ids: ids.map(column => ({ column: column.name.toString() })).toArray()
    })
  });
  //public async delete(query: StoreSelectFilters) {}
  //public async deleteById(id: number | string) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'deleteById',
    parameters: ids.map(column => ({
      name: column.name.toPropertyName(),
      type: typemap[column.type.name]!
    })).toArray(),
    statements: renderCode(TEMPLATE.DELETE_BY_ID, {
      ids: ids.map(
        column => ({ column: column.name.toString() })
      ).toArray()
    })
  });
  //public async findById(id: number | string, columns = [ '*' ]) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'findById',
    parameters: [
      ...ids.map(column => ({
        name: column.name.toPropertyName(),
        type: typemap[column.type.name]!
      })).toArray(),
      { name: 'columns', initializer: '[ \'*\' ]' }
    ],
    statements: renderCode(TEMPLATE.FIND_BY_ID, {
      ids: ids.map(
        column => ({ column: column.name.toString() })
      ).toArray()
    })
  });
  //public async remove(query: StoreSelectFilters) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'remove',
    parameters: [{
      name: 'query',
      type: `StoreSelectFilters`
    }],
    statements: renderCode(TEMPLATE.REMOVE, {
      active: Boolean(model.store.active),
      column: model.store.active?.name.toString() || ''
    })
  });
  //public async removeById(id: number | string) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'removeById',
    parameters: ids.map(column => ({
      name: column.name.toPropertyName(),
      type: typemap[column.type.name]!
    })).toArray(),
    statements: renderCode(TEMPLATE.REMOVE_BY_ID, {
      ids: ids.map(
        column => ({ column: column.name.toString() })
      ).toArray()
    })
  });
  //public async restore(query: StoreSelectFilters) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'restore',
    parameters: [{
      name: 'query',
      type: `StoreSelectFilters`
    }],
    statements: renderCode(TEMPLATE.RESTORE, {
      active: Boolean(model.store.active),
      column: model.store.active?.name.toString() || ''
    })
  });
  //public async restoreById(id: number | string) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'restoreById',
    parameters: ids.map(column => ({
      name: column.name.toPropertyName(),
      type: typemap[column.type.name]!
    })).toArray(),
    statements: renderCode(TEMPLATE.RESTORE_BY_ID, {
      ids: ids.map(
        column => ({ column: column.name.toString() })
      ).toArray()
    })
  });
  //public async updateById(id: number | string, input: Partial<ProfileInput>) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'updateById',
    parameters: [
      ...ids.map(column => ({
        name: column.name.toPropertyName(),
        type: typemap[column.type.name]!
      })).toArray(),
      {
        name: 'input',
        type: model.name.toTypeName('Partial<%sInput>')
      }
    ],
    statements: renderCode(TEMPLATE.UPDATE_BY_ID, {
      ids: ids.map(
        column => ({ column: column.name.toString() })
      ).toArray()
    })
  });
  //public async upsert(input: ProfileInput) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'upsert',
    parameters: [{
      name: 'input',
      type: model.name.toTypeName('%sInput')
    }],
    statements: renderCode(TEMPLATE.UPSERT, {
      update: ids.map(
        column => `typeof input.${column.name.toPropertyName()} !== 'undefined'`
      ).toArray().join(' && '),
      ids: ids.map(
        column => ({ column: column.name.toString() })
      ).toArray(),
      uniques: model.store.uniques.map(
        column => ({ column: column.name.toString() })
      ).toArray()
    })
  });
};

export const TEMPLATE = {

//public constructor(engine: Engine, seed = '') {}
CONSTRUCTOR:
`super(engine, seed);
this.store = new <%store%>(seed);`,

//public async batch(inputs: Array<ProfileInput>, mode = 'upsert') {}
BATCH:
`const results: StatusResponse<<%type%> | null>[] = [];
try {
  await this.engine.transaction(async () => {
    let rollback = false;
    for (const input of inputs) {
      try {
        if (mode === 'upsert') {
          results.push({ 
            code: 200, 
            status: 'OK', 
            results: await this.upsert(input),
            total: 1
          });
        } else if (mode === 'create') {
          results.push({ 
            code: 200, 
            status: 'OK', 
            results: await this.create(input),
            total: 1
          });
        } else if (mode === 'update') {
          if (typeof input.id !== 'undefined') {
            results.push({ 
              code: 200, 
              status: 'OK', 
              results: await this.updateById(input.id, input),
              total: 1
            });
            continue;
          } 
          <%#uniques%>
            if (typeof input.<%column%> !== 'undefined') {
              const query = { filter: { <%column%>: input.<%column%> } };
              const exists = await this.find(query);
              if (exists) {
                const rows = await this.update(query, input);
                results.push({ 
                  code: 200, 
                  status: 'OK', 
                  results: rows[0] || null,
                  total: 1
                });
                continue;
              }
            }
          <%/uniques%>
          results.push({ error: 'ID or unique field is required for update mode' });
        }
      } catch (e) {
        const error = e as any;
        const exception = typeof error.toResponse !== 'function'
          ? Exception.upgrade(error)
          : error as Exception;
        const response = exception.toResponse();
        results.push({ 
          code: response.code, 
          status: response.status, 
          error: response.error, 
          errors: response.errors 
        });
        rollback = true;
      }
    }
    if (rollback) {
      throw Exception.for('Batch operation failed');
    }
  });
} catch(e) {}
return results;`,

CREATE:
`const insert = this.store.insert(input);
insert.engine = this.engine;
//dont rely on native insert... 
// pgsql returns different things than sqlite and mysql....
const rows = await insert;
//if there are rows, then it's pgsql...
if (rows.length > 0) {
  return this.store.unserialize(rows[0]);
}
//must be mysql or sqlite...
<%#oneid%>
  return (await this.findById(
    this.engine.connection.lastId as <%type%>
  ))!;
<%/oneid%>
<%#multid%>
  return await this.find({ 
   filter: { <%#ids%><%column%>: input.<%column%>, <%/ids%> } 
  });
<%/multid%>
<%#noid%>
  return input as unknown as T;
<%/noid%>
`,

//public async deleteById(id: number | string) {}
DELETE_BY_ID:
`const filter = { <%#ids%><%column%>, <%/ids%> };
const rows = await this.delete({ filter });
return rows[0] || null;`,

//public async findById(id: number | string, columns = [ '*' ]) {}
FIND_BY_ID:
`const filter = { <%#ids%><%column%>, <%/ids%> };
return await this.find({ columns, filter });`,

//public async remove(query: StoreSelectFilters) {}
REMOVE:
`<%#active%>
  return await this.update(query, { <%column%>: false });
<%/active%>
<%^active%>
  return await this.delete(query);
<%/active%>`,

//public async removeById(id: number | string) {}
REMOVE_BY_ID:
`const filter = { <%#ids%><%column%>, <%/ids%> };
const rows = await this.remove({ filter });
return rows[0] || null;`,

//public async restore(query: StoreSelectFilters) {}
RESTORE:
`<%#active%>
  return await this.update(query, { <%column%>: true });
<%/active%>`,

//public async restoreById(id: number | string) {}
RESTORE_BY_ID:
`const filter = { <%#ids%><%column%>, <%/ids%> };
const rows = await this.restore({ filter });
return rows[0] || null;`,

//public async updateById(id: number | string, input: Partial<ProfileInput>) {}
UPDATE_BY_ID:
`const filter = { <%#ids%><%column%>, <%/ids%> };
const rows = await this.update({ filter }, input);
return rows[0] || null;`,

//public async upsert(input: ProfileInput) {}
UPSERT:
`if (<%update%>) {
  return await this.updateById(<%#ids%>input.<%column%>, <%/ids%> input);
}
<%#uniques%>
  if (typeof input.<%column%> !== 'undefined') {
    const query = { filter: { <%column%>: input.<%column%> } };
    const exists = await this.find(query);
    if (exists) {
      const rows = await this.update(query, input);
      return rows[0] || null;
    }
  }
<%/uniques%>
return await this.create(input);`,

};