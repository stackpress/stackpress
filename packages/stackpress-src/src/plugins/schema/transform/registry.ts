//modules
import type { Directory } from 'ts-morph';
//schema
import type Registry from '../../../schema/Registry';

/**
 * This is the The params comes form the cli
 */
export default function generate(directory: Directory, registry: Registry) {
  //-----------------------------//
  // 1. profile/config.ts
  for (const model of registry.model.values()) {
    const filepath = `${model.name}/config.ts`;
    const source = directory.createSourceFile(filepath, '', { overwrite: true });
    //import type Model from 'stackpress/schema/spec/Model';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: 'stackpress/schema/spec/Model',
      defaultImport: 'Model'
    });
    //import registry from '../registry';
    source.addImportDeclaration({
      moduleSpecifier: `../registry`,
      defaultImport: 'registry'
    });
    //const config = registry.model.get('profile');
    source.addStatements(`const config = registry.model.get('${model.name}') as Model;`);
    //export default config;
    source.addStatements(`export default config;`);
  }
  
  //-----------------------------//
  // 2. address/config.ts
  for (const fieldset of registry.fieldset.values()) {
    const filepath = `${fieldset.name}/config.ts`;
    const source = directory.createSourceFile(filepath, '', { overwrite: true });
    //import type Fieldset from 'stackpress/schema/spec/Fieldset';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: 'stackpress/schema/spec/Fieldset',
      defaultImport: 'Fieldset'
    });
    //import registry from '../registry';
    source.addImportDeclaration({
      moduleSpecifier: `../registry`,
      defaultImport: 'registry'
    });
    //const config = registry.fieldset.get('profile');
    source.addStatements(`const config = registry.fieldset.get('${fieldset.name}') as Fieldset;`);
    //export default config;
    source.addStatements(`export default config;`);
  }

  //-----------------------------//
  // 3. registry.ts
  const source = directory.createSourceFile('registry.ts', '', { overwrite: true });
  //import type { SchemaConfig } from '@stackpress/idea-parser';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/idea-parser',
    namedImports: [ 'SchemaConfig' ]
  });
  //import Registry from 'stackpress/schema/Registry';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/schema/Registry',
    defaultImport: 'Registry'
  });
  //import config from './config.json';
  source.addImportDeclaration({
    moduleSpecifier: './config.json',
    defaultImport: 'config'
  });
  //export default new Registry(schema);
  source.addStatements(`export default new Registry(config as unknown as SchemaConfig);`);
}