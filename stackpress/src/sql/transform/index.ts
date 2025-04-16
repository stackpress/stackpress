//schema
import Registry from '../../schema/Registry.js';
//root
import type { IdeaPluginWithProject } from '../../types/index.js';
//local
import generateSchema from './schema.js';
import generateActions from './actions.js';
import generateEvents from './events.js';
import generateTests from './tests/index.js';

/**
 * Client File Structure
 * - profile/
 * | - actions/
 * | | - batch.ts
 * | | - create.ts
 * | | - detail.ts
 * | | - get.ts
 * | | - index.ts
 * | | - remove.ts
 * | | - restore.ts
 * | | - search.ts
 * | | - update.ts
 * | | - upsert.ts
 * | - events/
 * | | - batch.ts
 * | | - create.ts
 * | | - detail.ts
 * | | - get.ts
 * | | - index.ts
 * | | - remove.ts
 * | | - restore.ts
 * | | - search.ts
 * | | - update.ts
 * | | - upsert.ts
 * | - tests/
 * | | - actions.ts
 * | | - events.ts
 * | | - index.ts
 * | - index.ts
 * | - schema.ts
 * | - tests.ts
 */

/**
 * This is the The params comes form the cli
 */
export default async function generate(props: IdeaPluginWithProject) {
  //-----------------------------//
  // 1. Config
  //extract props
  const { schema, project } = props;
  const registry = new Registry(schema);

  //-----------------------------//
  // 2. Generators
  // - profile/actions.ts
  generateActions(project, registry);
  // - profile/events.ts
  generateEvents(project, registry);
  // - profile/schema.ts
  generateSchema(project, registry);
  // - profile/tests.ts
  generateTests(project, registry);

  //-----------------------------//
  // 3. Profile/index.ts

  for (const model of registry.model.values()) {
    const filepath = `${model.name}/index.ts`;
    //load profile/index.ts if it exists, if not create it
    const source = project.getSourceFile(filepath) 
      || project.createSourceFile(filepath, '', { overwrite: true });
    //import action from './actions/index.js';
    source.addImportDeclaration({
      moduleSpecifier: './actions/index.js',
      defaultImport: 'actions'
    });
    //import events from './events/index.js';
    source.addImportDeclaration({
      moduleSpecifier: './events/index.js',
      defaultImport: 'events'
    });
    //import schema from './schema.js';
    source.addImportDeclaration({
      moduleSpecifier: './schema.js',
      defaultImport: 'schema'
    });
    //export { actions, schema, events };
    source.addExportDeclaration({ 
      namedExports: [ 'actions', 'schema', 'events' ] 
    });
  }
};