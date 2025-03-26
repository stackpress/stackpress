//schema
import Registry from '../../schema/Registry';
//root
import type { IdeaPluginWithProject } from '../../types';
//local
import generateSchema from './schema';
import generateActions from './actions';
import generateEvents from './events';
import generateTests from './tests';

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
  // 3. profile/index.ts

  for (const model of registry.model.values()) {
    const filepath = `${model.name}/index.ts`;
    //load profile/index.ts if it exists, if not create it
    const source = project.getSourceFile(filepath) 
      || project.createSourceFile(filepath, '', { overwrite: true });
    //import action from './actions';
    source.addImportDeclaration({
      moduleSpecifier: './actions',
      defaultImport: 'actions'
    });
    //import events from './events';
    source.addImportDeclaration({
      moduleSpecifier: './events',
      defaultImport: 'events'
    });
    //import schema from './schema';
    source.addImportDeclaration({
      moduleSpecifier: './schema',
      defaultImport: 'schema'
    });
    //export { actions, schema, events };
    source.addExportDeclaration({ 
      namedExports: [ 'actions', 'schema', 'events' ] 
    });
  }
};