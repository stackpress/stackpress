//modules
import type { Directory } from 'ts-morph';
//schema
import Registry from '../../../schema/Registry.js';
//sql
import { sequence } from '../../helpers.js';
//local
import generateActions from './actions.js';
import generateEvents from './events.js';

/**
 * Client File Structure
 * - profile/
 * | - tests/
 * | | - actions.ts
 * | | - events.ts
 * | | - index.ts
 * - tests.ts
 */

/**
 * This is the The params comes form the cli
 */
export default function generate(directory: Directory, registry: Registry) {
  //-----------------------------//
  // 2. Generators
  // - profile/tests/actions.ts
  generateActions(directory, registry);
  // - profile/tests/events.ts
  generateEvents(directory, registry);

  //-----------------------------//
  // 3. profile/tests/index.ts
  for (const model of registry.model.values()) {
    const source = directory.createSourceFile(
      `${model.name}/tests/index.ts`,
      '', 
      { overwrite: true }
    );
    //import type { HttpServer } from '@stackpress/ingest';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/ingest',
      namedImports: [ 'HttpServer' ]
    });
    //import actions from './actions.js';
    source.addImportDeclaration({
      moduleSpecifier: './actions.js',
      defaultImport: 'actions'
    });
    //import events from './events.js';
    source.addImportDeclaration({
      moduleSpecifier: './events.js',
      defaultImport: 'events'
    });
    //export default function tests(server: HttpServer) {}
    source.addFunction({
      isDefaultExport: true,
      name: 'tests',
      parameters: [{ name: 'server', type: 'HttpServer' }],
      statements: (`
        actions(server.plugin('database'));
        events(server);  
      `)
    });
  }

  //-----------------------------//
  // 3. tests.ts
  
  const source = directory.createSourceFile(
    'tests.ts',
    '', 
    { overwrite: true }
  );
  //import type { HttpServer } from '@stackpress/ingest';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/ingest',
    namedImports: [ 'HttpServer' ]
  });
  //import profileTests from './Profile/tests/index.js';
  for (const model of registry.model.values()) {
    source.addImportDeclaration({
      moduleSpecifier: `./${model.name}/tests/index.js`,
      defaultImport: `${model.camel}Tests`
    });
  }

  const models = Array.from(registry.model.values());
  const order = sequence(models);
  //export default function tests(server: HttpServer) {}
  source.addFunction({
    isDefaultExport: true,
    name: 'tests',
    parameters: [{ name: 'server', type: 'HttpServer' }],
    statements: order.reverse().map(model => `${model.camel}Tests(server);`)
  });
};