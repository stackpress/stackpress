//modules
import type { Directory } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../schema/transform/helpers.js';
//stackpress/sql
import generateAlter from './alter.js';
import generateCount from './count.js';
import generateCreate from './create.js';
import generateDelete from './delete.js';
import generateInsert from './insert.js';
import generateSelect from './select.js';
import generateUpdate from './update.js';

const strings = [ 'String', 'Text' ];
//these are possible column types to map what formatter (below) to use
export const stringable = [ 'String', 'Text', 'Json', 'Object', 'Hash' ];
export const floatable = [ 'Number', 'Float' ];
export const dateable = [ 'Date', 'Time', 'Datetime' ];
export const boolable = [ 'Boolean' ];
export const intable = [ 'Integer' ];

export default function generate(directory: Directory, model: Model) {
  //relations like this: (foriegn keys)
  // owner User @relation({ name "connections" local "userId" foreign "id" })
  //not like this: (local keys)
  // users User[]
  const relations = model.store.foreignRelationships;

  const filepath = model.name.toPathName('%s/%sStore.ts');
  //load Profile/index.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //import type { 
  //  StoreSelectColumnPath, 
  //  StoreSelectFilters,
  //  StoreSelectJoinMap, 
  //  StoreSelectQuery,
  //  ValuePrimitive,
  //  ValueScalar
  //} from 'stackpress/sql/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/sql/types',
    namedImports: [ 
      'StoreSelectColumnPath',
      'StoreSelectFilters',
      'StoreSelectJoinMap',
      'StoreSelectQuery',
      'ValuePrimitive',
      'ValueScalar'
    ]
  });
  //import { getAlias, toSqlString, ... } from 'stackpress/sql/helpers';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/sql/helpers',
    namedImports: [ 
      'getAlias',
      ...model.columns.findValue(
        column => stringable.includes(column.type.name)
      ) ? [ 'toSqlString' ] : [],
      ...model.columns.findValue(
        column => floatable.includes(column.type.name)
      ) ? [ 'toSqlFloat' ] : [],
      ...model.columns.findValue(
        column => intable.includes(column.type.name)
      ) ? [ 'toSqlInteger' ] : [],
      ...model.columns.findValue(
        column => boolable.includes(column.type.name)
      ) ? [ 'toSqlBoolean' ] : [],
      ...model.columns.findValue(
        column => dateable.includes(column.type.name)
      ) ? [ 'toSqlDate' ] : [] 
    ]
  });
  //import ProfileStore from '../Profile/ProfileStore.js';
  for (const column of relations.values()) {
    //this should never happen...
    if (!column.type.model) continue;
    //import ProfileStore from '../Profile/ProfileStore.js';
    source.addImportDeclaration({
      moduleSpecifier: column.type.model.name.toPathName('../%s/%sStore.js'),
      defaultImport: column.type.model.name.toClassName('%sStore')
    });
  }
  //import type { Profile, ProfileExtended, ProfileStoreInterface } from './types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: './types.js',
    namedImports: [ 
      model.name.toTypeName(),
      model.name.toTypeName('%sExtended'),
      model.name.toClassName('%sStoreInterface')
    ]
  });
  //import ProfileSchema from './ProfileSchema.js';
  source.addImportDeclaration({
    moduleSpecifier: `./${model.name.toClassName('%sSchema.js')}`,
    defaultImport: model.name.toClassName('%sSchema')
  });

  //export default class ProfileStore extends ProfileSchema {}
  const definition = source.addClass({
    isDefaultExport: true,
    name: model.name.toClassName('%sStore'),
    extends: model.name.toClassName('%sSchema'),
    implements: [ model.name.toClassName('%sStoreInterface') ]
  });
  //public readonly relations;
  definition.addProperty({
    scope: Scope.Public,
    isReadonly: true,
    name: 'relations'
  });
  //public readonly table = 'street_address';
  definition.addProperty({
    scope: Scope.Public,
    isReadonly: true,
    name: 'table',
    initializer: JSON.stringify(model.name.toTableName())
  });
  //public constructor(seed = '') {}
  definition.addConstructor({
    scope: Scope.Public,
    parameters: [{ name: 'seed', initializer: "''" }],
    statements: renderCode(TEMPLATE.CONSTRUCTOR, {
      columns: relations.map(column => {
        const relation = column.store.foreignRelationship!;
        return { 
          column: column.name.toString(),
          store: column.name.toClassName('%sStore'),
          local: relation.local.key.name.snakeCase,
          foreign: relation.foreign.key.name.snakeCase,
          multiple: relation.foreign.type === 2,
          required: relation.foreign.type === 1
        };
      }).toArray()
    })
  });
  //public count(query: StoreSearchParams = {}, q = '"') {}
  generateCount(model, definition);
  //public alter() {}
  generateAlter(source, definition);
  //public create() {}
  generateCreate(source, model, definition);
  //public delete(query: StoreSearchParams = {}, q = '"') {}
  generateDelete(source, model, definition);
  //public insert(input: Partial<Place>) {}
  generateInsert(source, model, definition);
  //public select(query: StoreSearchParams = {}, q = '"') {}
  generateSelect(source, model, definition);
  //public update(query: StoreSearchParams = {}, input: Partial<Place>, q = '"') {}
  generateUpdate(source, model, definition);
  //public scalarize(values: Record<string, unknown>) {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'scalarize',
    parameters: [{ name: 'values', type: 'Record<string, unknown>' }],
    statements: renderCode(TEMPLATE.SCALARIZE, {
      columns: model.columns
        .filter(column => !column.type.model)
        .map(column => ({
          column: column.name.toString(),
          snake: column.name.snakeCase,
          encrypt: strings.includes(column.type.name) 
            && (column.value.encrypted || column.value.hashed),
        }))
        .toArray()
    })
  });
  //public toSqlValue(column: string, value: unknown) {}
  definition.addMethod({
    name: 'toSqlValue',
    scope: Scope.Public,
    parameters: [
      { name: 'column', type: 'string' },
      { name: 'value', type: 'unknown' }
    ],
    statements: renderCode(TEMPLATE.TO_SQL_VALUE, {
      columns: model.columns
        .filter(column => !column.type.model)
        .map(column => ({ 
          column: column.name.toString(),
          nullable: column.type.nullable,
          serializer: stringable.includes(column.type.name) || column.type.enum
            ? 'toSqlString(value, true)'
            : floatable.includes(column.type.name)
            ? 'toSqlFloat(value, true)'
            : intable.includes(column.type.name)
            ? 'toSqlInteger(value, true)'
            : boolable.includes(column.type.name)
            ? 'toSqlBoolean(value, true)'
            : dateable.includes(column.type.name)
            ? 'toSqlDate(value, true)?.toISOString()'
            //: column.type.fieldset
            //: column.type.multiple
            : 'toSqlString(value, true)'
        })
      ).toArray()
    })
  });
  //public unscalarize(values: Record<string, unknown>): Partial<Profile> {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'unscalarize',
    parameters: [{ name: 'values', type: 'Record<string, unknown>' }],
    returnType: `Partial<${model.name.toTypeName()}>`,
    statements: renderCode(TEMPLATE.UNSCALARIZE, {
      columns: model.columns
        .filter(column => !column.type.model)
        .map(column => ({
          column: column.name.toString(),
          snake: column.name.snakeCase,
          decrypt: strings.includes(column.type.name) 
            && column.value.encrypted,
        }))
        .toArray()
    })
  });
};

export const TEMPLATE = {

CONSTRUCTOR:
`super(seed);
this.relations = {
  <%#columns%>
    <%column%>: { 
      store: new <%store%>(seed), 
      local: '<%local%>', 
      foreign: '<%foreign%>', 
      multiple: <%multiple%>, 
      required: <%required%> 
    },
  <%/columns%>
};
`,

SCALARIZE:
`const scalarized: Record<string, ValueScalar> = {};
for (const [ name, value ] of Object.entries(values)) {
  <%#columns%>
    if (name === '<%column%>' && typeof value !== 'undefined') {
      const column = this.columns.<%column%>;
      <%#encrypt%>
        scalarized.<%snake%> = this.toSqlValue(
          '<%column%>', 
          column.serialize(value, true)
        )! as ValueScalar;
      <%/encrypt%>
      <%^encrypt%>
        scalarized.<%snake%> = this.toSqlValue(
          '<%column%>',
          column.serialize(value)
        )! as ValueScalar;
      <%/encrypt%>
      continue;
    }
  <%/columns%>
}
return scalarized;`,

TO_SQL_VALUE:
`<%#columns%>
  if (column === '<%column%>') {
    <%#nullable%>
      if (value === null) {
        return null;
      }
    <%/nullable%>
    return <%serializer%>;
  }
<%/columns%>
return typeof value === 'undefined'
  ? undefined
  : value === null
  ? null
  : String(value);`,

UNSCALARIZE:
`const unscalarized: Record<string, ValuePrimitive> = {};
for (const [ name, value ] of Object.entries(values)) {
  <%#columns%>
    if (name === '<%snake%>' && typeof value !== 'undefined') {
      const column = this.columns.<%column%>;
      <%#decrypt%>
        unscalarized.<%column%> = column.unserialize(value, true)! as ValuePrimitive;
      <%/decrypt%>
      <%^decrypt%>
        unscalarized.<%column%> = column.unserialize(value)! as ValuePrimitive;
      <%/decrypt%>
      continue;
    }
  <%/columns%>
}
return unscalarized;`

};