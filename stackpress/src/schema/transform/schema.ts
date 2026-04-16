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
  //import AbstractSchema from 'stackpress/AbstractSchema';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/AbstractSchema',
    defaultImport: 'AbstractSchema'
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
    //extends AbstractSchema<Address, { ColumnSchema, ... }>
    extends: `AbstractSchema<${model.name.toTypeName()}, {${
      columns.map(
        column => `${column.name.toString()}: ${column.name.toClassName('%sColumn')}`
      ).toArray().join(', ')
    }}>`,
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

DEFAULTS:
`return {
  <%#each columns%>
    <%column%>: this.columns.<%column%>.defaults,
  <%/each%>
};`,

CONSTRUCTOR:
`super(seed);
this.columns = {
  <%#each columns%>
    <%column%>: new <%classname%>(<%seed%>),
  <%/each%>
};
this.shape = z.object({
  <%#each columns%>
    <%column%>: this.columns.<%column%>.shape,
  <%/each%>
});`,

ASSERT:
`const errors = {
  <%#each columns%>
    <%column%>: required || typeof value.<%column%> !== 'undefined' 
      ? (this.columns.<%column%>.assert(value.<%column%>) || undefined)
      : undefined,
  <%/each%>
};
return Object.values(errors).some(Boolean) 
  ? removeUndefined(errors) 
  : null;`,

SERIALIZE:
`return removeUndefined({
  <%#each columns%>
    <%#if column.fieldset%>
      <%column%>: JSON.stringify(
        this.columns.<%column%>.serialize(value.<%column%>)
      ),
    <%else%>
      <%column%>: this.columns.<%column%>.serialize(value.<%column%>),
    <%/if%>
  <%/each%>
});`,

UNSERIALIZE:
`return removeUndefined({
  <%#each columns%>
    <%column%>: this.columns.<%column%>.unserialize(value.<%column%>),
  <%/each%>
});`

};