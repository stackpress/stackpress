//modules
import type { Directory } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress/schema
import type Fieldset from '../Fieldset.js';
//stackpress/schema/transform
import { loadProjectFile, renderCode } from './helpers.js';

export default function generate(directory: Directory, model: Fieldset) {
  const imported: string[] = [];
  
  //dont include columns that are models 
  //(those are more of relational information)
  const columns = model.columns.filter(
    column => !column.type.model
  );

  //------------------------------------------------------------------//
  // Address/AddressSchema.ts

  const filepath = model.name.toPathName('%s/%sSchema.ts');
  //load file if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules

  //import * as z from 'zod';
  source.addImportDeclaration({
    moduleSpecifier: 'zod',
    namespaceImport: 'z'
  });

  //------------------------------------------------------------------//
  // Import Stackpress

  //import { removeUndefined } from 'stackpress/schema/helpers';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/schema/helpers',
    namedImports: [ 'removeUndefined' ]
  });

  //------------------------------------------------------------------//
  // Import Client

  //import StreetColumn from './columns/StreetColumn.js';
  for (const column of columns.values()) {
    const name = column.name.toClassName('%sColumn')
    if (imported.includes(name)) continue;
    imported.push(name);
    //import StreetColumn from './columns/StreetColumn.js';
    source.addImportDeclaration({
      moduleSpecifier: column.name.toPathName('./columns/%sColumn.js'),
      defaultImport: column.name.toClassName('%sColumn')
    });
  }
  //import type { Profile, ProfileSchemaInterface } from './types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: './types.js',
    namedImports: [ 
      model.name.toTypeName(), 
      model.name.toClassName('%sSchemaInterface') 
    ]
  });

  //------------------------------------------------------------------//
  // Exports

  //export default class AddressSchema {};
  const definition = source.addClass({
    isDefaultExport: true,
    name: model.name.toClassName('%sSchema'),
    //implements ProfileSchemaInterface
    implements: [ model.name.toClassName('%sSchemaInterface') ]
  });
  //public readonly name = 'StreetAddress';
  definition.addProperty({
    scope: Scope.Public,
    isReadonly: true,
    name: 'name',
    initializer: JSON.stringify(model.name.toString())
  });
  //public readonly column;
  //(done this way to prevent namespace issues)
  definition.addProperty({
    scope: Scope.Public,
    isReadonly: true,
    name: 'columns'
  });
  //public readonly shape;
  definition.addProperty({
    scope: Scope.Public,
    isReadonly: true,
    name: 'shape'
  });
  //protected _seed: string;
  definition.addProperty({
    scope: Scope.Protected,
    name: '_seed',
    type: 'string'
  });
  //public get defaults() {}
  definition.addGetAccessor({
    scope: Scope.Public,
    name: 'defaults',
    statements: renderCode(TEMPLATE.DEFAULTS, {
      columns: columns.map(column => ({
        column: column.name.toString()
      })).toArray()
    })
  });
  //public constructor(seed = '') {}
  definition.addConstructor({
    scope: Scope.Public,
    parameters: [{ name: 'seed', initializer: "''" }],
    statements: renderCode(TEMPLATE.CONSTRUCTOR, {
      columns: columns.map(column => ({ 
        column: column.name.toPropertyName(), 
        classname: column.name.toClassName('%sColumn'),
        seed: column.value.encrypted ? 'seed': ''
      })).toArray()
    })
  });
  //public assert(value: Record<string, any>, required = false) {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'assert',
    parameters: [
      { name: 'value', type: 'Record<string, any>' },
      { name: 'required', initializer: 'false' }
    ],
    statements: renderCode(TEMPLATE.ASSERT, {
      columns: columns.map(column => ({
        column: column.name.toString(),
      })).toArray()
    })
  });
  //public filter<V extends Record<string, any>>(value: V, populate = false) {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'filter',
    typeParameters: [{ name: 'V', constraint: 'Record<string, any>' }],
    parameters: [
      { name: 'value', type: 'V' },
      { name: 'populate', initializer: 'false' }
    ],
    statements: renderCode(TEMPLATE.FILTER, {
      type: model.name.toTypeName()
    })
  });
  //public populate<V extends Record<string, any>>(value: V) {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'populate',
    typeParameters: [{ name: 'V', constraint: 'Record<string, any>' }],
    parameters: [{ name: 'value', type: 'V' }],
    statements: TEMPLATE.POPULATE
  });
  //public serialize(value: Record<string, any>) {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'serialize',
    parameters: [{ name: 'value', type: 'Record<string, any>' }],
    statements: renderCode(TEMPLATE.SERIALIZE, {
      columns: columns.map(column => ({
        fieldset: !!column.type.fieldset,
        column: column.name.toString(),
      })).toArray()
    })
  });
  //public unserialize(value: Record<string, any>) {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'unserialize',
    parameters: [{ name: 'value', type: 'Record<string, any>' }],
    statements: renderCode(TEMPLATE.UNSERIALIZE, {
      columns: columns.map(column => ({
        column: column.name.toString(),
      })).toArray()
    })
  });
  return definition;
};

//------------------------------------------------------------------//
// Templates

export const TEMPLATE = {

//public get defaults() {}
DEFAULTS:
`return {
  <%#columns%>
    <%column%>: this.columns.<%column%>.defaults,
  <%/columns%>
};`,

//public constructor(seed = '') {}
CONSTRUCTOR:
`this._seed = seed;
this.columns = {
  <%#columns%>
    <%column%>: new <%classname%>(<%seed%>),
  <%/columns%>
};
this.shape = z.object({
  <%#columns%>
    <%column%>: this.columns.<%column%>.shape,
  <%/columns%>
});`,

//public assert(value: Record<string, any>, required = false) {}
ASSERT:
`const errors = {
  <%#columns%>
    <%column%>: required || typeof value.<%column%> !== 'undefined' 
      ? (this.columns.<%column%>.assert(value.<%column%>) || undefined)
      : undefined,
  <%/columns%>
};
return Object.values(errors).some(Boolean) 
  ? removeUndefined(errors) 
  : null;`,

//public filter<V extends Record<string, any>>(value: V, populate = false) {}
FILTER:
`const filtered = Object.fromEntries(
  Object.entries(value).filter(([key]) => key in this.columns),
) as Partial<<%type%>>;
return populate ? this.populate(filtered) : filtered;`,

//public populate<V extends Record<string, any>>(value: V) {}
POPULATE:
`return { ...this.defaults, ...value } as typeof this.defaults & V;`,

//public serialize(value: Record<string, any>) {}
SERIALIZE:
`return removeUndefined({
  <%#columns%>
    <%#fieldset%>
      <%column%>: JSON.stringify(
        this.columns.<%column%>.serialize(value.<%column%>)
      ),
    <%/fieldset%>
    <%^fieldset%>
      <%column%>: this.columns.<%column%>.serialize(value.<%column%>),
    <%/fieldset%>
  <%/columns%>
});`,

//public unserialize(value: Record<string, any>) {}
UNSERIALIZE:
`return removeUndefined({
  <%#columns%>
    <%column%>: this.columns.<%column%>.unserialize(value.<%column%>),
  <%/columns%>
});`

};