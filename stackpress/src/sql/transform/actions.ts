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

  //------------------------------------------------------------------//
  // Import Modules

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

  //------------------------------------------------------------------//
  // Import Stackpress

  //import type { StoreSelectFilters } from 'stackpress/sql/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/sql/types',
    namedImports: [ 'StoreSelectFilters' ]
  });
  //import { removeUndefined, removeEmptyStrings } from 'stackpress/schema/helpers';
  source.addImportDeclaration({
    namedImports: [ 'removeUndefined', 'removeEmptyStrings' ],
    moduleSpecifier: 'stackpress/schema/helpers'
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

  //------------------------------------------------------------------//
  // Import Client

  //import type { Profile, ProfileExtended, ProfileActionsInterface, ProfileAssertInterfaceMap } from './types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: './types.js',
    namedImports: [ 
      model.name.toTypeName(),
      model.name.toTypeName('%sExtended'),
      model.name.toTypeName('%sActionsInterface'),
      model.name.toTypeName('%sAssertInterfaceMap')
    ]
  });
  //import ProfileStore from './ProfileStore.js';
  source.addImportDeclaration({
    moduleSpecifier: model.name.toPathName('./%sStore.js'),
    defaultImport: model.name.toClassName('%sStore')
  });

  //------------------------------------------------------------------//
  // Exports
  
  //export default class ProfileActions {};
  const definition = source.addClass({
    name: model.name.toClassName('%sActions'),
    //extends AbstractActions<Place, PlaceExtended>
    extends: model.name.toTypeName('AbstractActions<%s, %sExtended>'),
    //implements ProfileActionsInterface
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
  //public async batch(inputs: Array<Partial<Profile>>, mode = 'upsert') {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'batch',
    parameters: [{
      name: 'inputs',
      type: model.name.toTypeName('Array<Partial<%s>>')
    }, {
      name: 'mode',
      type: `'create' | 'update' | 'upsert'`,
      initializer: `'upsert'`
    }],
    statements: renderCode(TEMPLATE.BATCH, {
      type: model.name.toTypeName(),
      store: model.name.toClassName('%sStore'),
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
  //public async create(input: Partial<Profile>) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'create',
    parameters: [{
      name: 'input',
      type: model.name.toTypeName('Partial<%s>')
    }],
    statements: renderCode(TEMPLATE.CREATE, {
      assert: model.name.toTypeName('%sAssertInterfaceMap'),
      oneid: ids.size === 1 ? ids.first().name.toString() : null,
      multid: ids.size > 1,
      type: model.name.toTypeName(),
      noid: ids.size === 0,
      ids: ids.map(
        column => ({ column: column.name.toString() })
      ).toArray(),
      exists: model.store.uniques.map(
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
  //public async restore(query: StoreSelectFilters) {}
  if (model.store.restorable) {
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
  }
  //public async update(query: StoreSelectFilters, input: Partial<Profile>) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'update',
    parameters: [
      { name: 'query', type: `StoreSelectFilters` }, 
      { name: 'input', type: model.name.toTypeName('Partial<%s>') }
    ],
    statements: renderCode(TEMPLATE.UPDATE, {
      assert: model.name.toTypeName('%sAssertInterfaceMap'),
      type: model.name.toTypeName(),
      uniques: model.store.uniques.size > 0,
      exists: model.store.uniques.map(
        column => ({ column: column.name.toString() })
      ).toArray()
    })
  });
  //public async upsert(input: Partial<Profile>) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'upsert',
    parameters: [{
      name: 'input',
      type: model.name.toTypeName('Partial<%s>')
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

//public async batch(inputs: Array<Partial<Profile>>, mode = 'upsert') {}
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
          <%#if ids.length%>
            if (<%update%>) {
              const filter = { 
                <%#each ids%>
                  <%column%>: input.<%column%>,
                <%/each%> 
              };
              const exists = await this.find({ filter });
              if (exists) {
                const rows = await this.update({ filter }, input);
                results.push({ 
                  code: 200, 
                  status: 'OK', 
                  results: rows[0] || null,
                  total: 1
                });
                continue;
              }
            }
          <%/if%>
          <%#each uniques%>
            if (
              typeof input.<%column%> !== 'undefined'
              && input.<%column%> !== null
              && input.<%column%> !== ''
            ) {
              const filter = { <%column%>: input.<%column%> };
              const exists = await this.find({ filter });
              if (exists) {
                const rows = await this.update({ filter }, input);
                results.push({ 
                  code: 200, 
                  status: 'OK', 
                  results: rows[0] || null,
                  total: 1
                });
                continue;
              }
            }
          <%/each%>
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
`//sanitize input and map to the schema
const filtered = this.store.filter(input);
const populated = this.store.populate(filtered);
const serialized = this.store.serialize(populated);
const unserialized = this.store.unserialize(serialized);
const defined = removeEmptyStrings(unserialized);
const sanitized = removeUndefined(defined);

//collect errors, if any
const errors = this.store.assert(sanitized, true) || {} as <%assert%>;

<%#each exists%>
  //if there's a <%column%> value
  if (
    typeof sanitized.<%column%> !== 'undefined'
    && sanitized.<%column%> !== null
    && sanitized.<%column%> !== ''
  ) {
    //check to see if exists already
    const exists = await this.find({ 
      filter: { <%column%>: sanitized.<%column%> } 
    });
    //if it does exist
    if (exists) {
      //add a unique error
      errors.<%column%> = 'Already exists';
    }
  }
<%/each%>

//if there were errors
if (Object.keys(errors).length > 0) {
  //throw errors
  throw Exception
    .for('Invalid parameters')
    .withCode(400)
    .withErrors(errors);
}

const insert = this.store.insert(sanitized);
insert.engine = this.engine;
//dont rely on native insert... 
// pgsql returns different things than sqlite and mysql....
const rows = await insert;
//if there are rows, then it's pgsql...
if (rows.length > 0) {
  return this.store.unserialize(rows[0]);
}
//must be mysql or sqlite...
<%#if oneid%>
  if (this.engine.connection.lastId) {
    const filter = { <%oneid%>: this.engine.connection.lastId };
    return await this.find({ filter }) || input as unknown as <%type%>;
  }
  return input as unknown as <%type%>;
<%/if%>
<%#if multid%>
  const filter = { <%#each ids%><%column%>: input.<%column%>!, <%/each%> };
  return await this.find({ filter }) || input as unknown as <%type%>;
<%/if%>
<%#if noid%>
  return input as unknown as <%type%>;
<%/if%>
`,

//public async remove(query: StoreSelectFilters) {}
REMOVE:
`<%#if active%>
  return await this.update(query, { <%column%>: false });
<%else%>
  return await this.delete(query);
<%/if%>`,

//public async restore(query: StoreSelectFilters) {}
RESTORE:
`<%#if active%>
  return await this.update(query, { <%column%>: true });
<%/if%>`,

//public async update(query: StoreSelectFilters, input: Partial<Profile>) {}
UPDATE:
`//sanitize input and map to the schema
const filtered = this.store.filter(input);
const serialized = this.store.serialize(filtered);
const unserialized = this.store.unserialize(serialized);
const defined = removeEmptyStrings(unserialized);
const sanitized = removeUndefined(defined);

//collect errors, if any
const errors = this.store.assert(sanitized) || {} as <%assert%>;

<%#if uniques%>
  //we need to check if the existing record 
  // is the same as the one about to be updated
  const queue = await this.findAll(query);
  <%#each exists%>
    //if there's a <%column%> value
    if (
      typeof sanitized.<%column%> !== 'undefined'
      && sanitized.<%column%> !== null
      && sanitized.<%column%> !== ''
    ) {
      //check to see if exists already
      const exists = await this.findAll({ 
        filter: { <%column%>: sanitized.<%column%> } 
      });
      //if it does exist
      if (exists.length > 0) {
        const same = queue.some(
          update => update.<%column%> === sanitized.<%column%>
        );
        if (!same) {
          //add a unique error
          errors.<%column%> = 'Already exists';
        }
      }
    }
  <%/each%>
<%/if%>

//if there were errors
if (Object.keys(errors).length > 0) {
  //throw errors
  throw Exception
    .for('Invalid parameters')
    .withCode(400)
    .withErrors(errors);
}

const rows = await this.findAll(query);
//if there are no rows, it doesn't make sense to update...
if (rows.length > 0) {
  const update = this.store.update(query, input, this.engine.dialect.q);
  update.engine = this.engine;
  //dont rely on native update... 
  // pgsql returns different things than sqlite and mysql....
  await update;
}
//we can't requery because the results might be different 
// after the update, so we have to manually merge the input 
// with the existing records
return rows.map(row => ({ ...row, ...sanitized })) as <%type%>[];`,

//public async upsert(input: Partial<Profile>) {}
UPSERT:
`<%#if ids.length%>
  if (<%update%>) {
    const filter = { 
      <%#each ids%>
        <%column%>: input.<%column%>,
      <%/each%> 
    };
    const rows = await this.update({ filter }, input);
    return rows[0] || null;
  }
<%/if%>
<%#uniques%>
  if (
    typeof input.<%column%> !== 'undefined'
    && input.<%column%> !== null
    && input.<%column%> !== ''
  ) {
    const filter = { <%column%>: input.<%column%> };
    const exists = await this.find({ filter });
    if (exists) {
      const rows = await this.update({ filter }, input);
      return rows[0] || null;
    }
  }
<%/uniques%>
return await this.create(input);`,

};