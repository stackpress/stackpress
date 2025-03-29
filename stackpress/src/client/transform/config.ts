//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress
import type { SchemaConfig } from '@stackpress/idea-parser';
import type Server from '@stackpress/ingest/Server';
//schema
import type Registry from '../../schema/Registry';
import Revisions from '../Revisions';

/**
 * This is the The params comes form the cli
 */
export default async function generate(
  directory: Directory, 
  schema: SchemaConfig, 
  registry: Registry,
  server: Server
) {
  //-----------------------------//
  // 1. Profile/config.ts
  for (const model of registry.model.values()) {
    const filepath = `${model.name}/config.ts`;
    const source = directory.createSourceFile(filepath, '', { overwrite: true });
    //import type Model from 'stackpress/Model';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: 'stackpress/Model',
      defaultImport: 'Model'
    });
    //import 'registry' from '../config';
    source.addImportDeclaration({
      moduleSpecifier: `../config`,
      defaultImport: 'registry'
    });
    //const config = registry.model.get('profile');
    source.addStatements(`const config = registry.model.get('${model.name}') as Model;`);
    //export default config;
    source.addStatements(`export default config;`);
  }
  
  //-----------------------------//
  // 2. Address/config.ts
  for (const fieldset of registry.fieldset.values()) {
    const filepath = `${fieldset.name}/config.ts`;
    const source = directory.createSourceFile(filepath, '', { overwrite: true });
    //import type Fieldset from 'stackpress/Fieldset';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: 'stackpress/Fieldset',
      defaultImport: 'Fieldset'
    });
    //import 'registry' from '../config';
    source.addImportDeclaration({
      moduleSpecifier: `../config`,
      defaultImport: 'registry'
    });
    //const config = registry.fieldset.get('profile');
    source.addStatements(`const config = registry.fieldset.get('${fieldset.name}') as Fieldset;`);
    //export default config;
    source.addStatements(`export default config;`);
  }

  //-----------------------------//
  // 3. Add revision
  //need revisions path
  const revisions = server.config.path<string>('client.revisions');
  //if can revision
  if (revisions) {
    //add a new revision
    Revisions.insert(revisions, server.loader, schema);
  }

  //-----------------------------//
  // 4. config.ts
  const source = directory.createSourceFile('config.ts', '', { overwrite: true });

  //import type { SchemaConfig } from '@stackpress/idea-parser';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/idea-parser',
    namedImports: [ 'SchemaConfig' ]
  });
  //import Registry from 'stackpress/Registry';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/Registry',
    defaultImport: 'Registry'
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
  
  //const registry = new Registry(schema);
  source.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'registry',
      initializer: 'new Registry(config)'
    }]
  });
  //export default config;
  source.addStatements(`export default registry;`);
};