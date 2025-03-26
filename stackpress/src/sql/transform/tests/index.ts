//modules
import type { Directory } from 'ts-morph';
//schema
import Registry from '../../../schema/Registry';
//sql
import { sequence } from '../../helpers';
//local
import generateActions from './actions';
import generateEvents from './events';

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
    //import type { HTTPServer } from '@stackpress/ingest';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/ingest',
      namedImports: [ 'HTTPServer' ]
    });
    //import actions from './actions';
    source.addImportDeclaration({
      moduleSpecifier: './actions',
      defaultImport: 'actions'
    });
    //import events from './events';
    source.addImportDeclaration({
      moduleSpecifier: './events',
      defaultImport: 'events'
    });
    //export default function tests(server: HTTPServer) {}
    source.addFunction({
      isDefaultExport: true,
      name: 'tests',
      parameters: [{ name: 'server', type: 'HTTPServer' }],
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
  //import profileTests from './profile/tests';
  for (const model of registry.model.values()) {
    source.addImportDeclaration({
      moduleSpecifier: `./${model.name}/tests`,
      defaultImport: `${model.camel}Tests`
    });
  }

  const models = Array.from(registry.model.values());
  const order = sequence(models);
  //export default function tests(server: HTTPServer) {}
  source.addFunction({
    isDefaultExport: true,
    name: 'tests',
    parameters: [{ name: 'server', type: 'HTTPServer' }],
    statements: order.reverse().map(model => `${model.camel}Tests(server);`)
  });
};