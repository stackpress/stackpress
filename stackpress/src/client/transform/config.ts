//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress
import type { SchemaConfig } from '@stackpress/idea-parser';
import type Server from '@stackpress/ingest/Server';
//schema
import type Schema from '../../schema/Schema.js';
import Revisions from '../Revisions.js';

/**
 * This is the The params comes form the cli
 */
export default async function generate(
  directory: Directory, 
  config: SchemaConfig, 
  schema: Schema,
  server: Server
) {
  //-----------------------------//
  // 1. Profile/config.ts
  for (const model of schema.models.values()) {
    const filepath = model.name.toPathName('%/config.ts');
    const source = directory.createSourceFile(filepath, '', { overwrite: true });
    //import type Model from 'stackpress/Model';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: 'stackpress/Model',
      defaultImport: 'Model'
    });
    //import 'schema' from '../config.js';
    source.addImportDeclaration({
      moduleSpecifier: '../config.js',
      defaultImport: 'schema'
    });
    //const config = schema.model.get('profile');
    source.addStatements(
      `const config = schema.model.get('${model.name.toString()}') as Model;`
    );
    //export default config;
    source.addStatements(`export default config;`);
  }
  
  //-----------------------------//
  // 2. Address/config.ts
  for (const fieldset of schema.fieldsets.values()) {
    const filepath = fieldset.name.toPathName('%/config.ts');
    const source = directory.createSourceFile(filepath, '', { overwrite: true });
    //import type Fieldset from 'stackpress/Fieldset';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: 'stackpress/Fieldset',
      defaultImport: 'Fieldset'
    });
    //import 'schema' from '../config.js';
    source.addImportDeclaration({
      moduleSpecifier: '../config.js',
      defaultImport: 'schema'
    });
    //const config = schema.fieldset.get('profile');
    source.addStatements(
      `const config = schema.fieldset.get('${fieldset.name.toString()}') as Fieldset;`
    );
    //export default config;
    source.addStatements('export default config;');
  }

  //-----------------------------//
  // 3. Add revision
  //need revisions path
  const revisions = server.config.path<string>('client.revisions');
  //if can revision
  if (revisions) {
    //add a new revision
    Revisions.insert(revisions, server.loader, config);
  }

  //-----------------------------//
  // 4. config.ts
  const source = directory.createSourceFile('config.ts', '', { overwrite: true });

  //import type { SchemaConfig } from '@stackpress/idea-parser';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/idea-parser',
    namedImports: [ 'SchemaConfig' ]
  });
  //import Schema from 'stackpress/Schema';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/Schema',
    defaultImport: 'Schema'
  });
  //export const config = {} as SchemaConfig;
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'config',
      type: 'SchemaConfig',
      initializer: JSON.stringify(schema, null, 2)
    }]
  });
  
  //const schema = new Schema(schema);
  source.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'schema',
      initializer: 'new Schema(config)'
    }]
  });
  //export default config;
  source.addStatements(`export default schema;`);
};