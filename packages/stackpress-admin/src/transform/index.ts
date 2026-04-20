//stackpress
import type { IdeaProjectPluginProps } from '../../types.js';
//stackpress/schema
import Schema from '../../schema/Schema.js';
import { loadProjectFile } from '../../schema/transform/helpers.js';
//stackpress/admin
import generatePages from './pages/index.js';
import generateViews from './views/index.js';
import generateRoutes from './routes.js';

/**
 * Client File Structure
 * - profile/
 * | - admin/
 * | | - pages/
 * | | | - copy.ts
 * | | | - create.ts
 * | | | - detail.ts
 * | | | - remove.ts
 * | | | - restore.ts
 * | | | - search.ts
 * | | | - update.ts
 * | | - views/
 * | | | - copy.tsx
 * | | | - create.tsx
 * | | | - detail.tsx
 * | | | - remove.tsx
 * | | | - restore.tsx
 * | | | - search.tsx
 * | | | - update.tsx
 * | | - routes.ts
 * - admin.ts
 */

export default async function generate(props: IdeaProjectPluginProps) {
  //------------------------------------------------------------------//
  // 1. Config

  const schema = Schema.make(props.schema);
  const directory = props.directory;

  //-----------------------------//
  // 2. Generators

  for (const model of schema.models.values()) {
    // - profile/admin/routes.ts
    generateRoutes(directory, model);
    // - profile/admin/pages/create.ts
    // - profile/admin/pages/detail.ts
    // - profile/admin/pages/remove.ts
    // - profile/admin/pages/restore.ts
    // - profile/admin/pages/search.ts
    // - profile/admin/pages/update.ts
    generatePages(directory, model);
    // - profile/admin/views/create.tsx
    // - profile/admin/views/detail.tsx
    // - profile/admin/views/remove.tsx
    // - profile/admin/views/restore.tsx
    // - profile/admin/views/search.tsx
    // - profile/admin/views/update.tsx
    generateViews(directory, model);
  }

  //-----------------------------//
  // 2. admin.ts

  //load admin.ts if it exists, if not create it
  const source = loadProjectFile(directory, 'admin.ts');
  
  //import Server from '@stackpress/ingest/Server';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/ingest/Server',
    defaultImport: 'Server'
  });
  //import profileRoutes from './profile/admin/routes.js';
  for (const model of schema.models.values()) {
    source.addImportDeclaration({
      moduleSpecifier: `./${model.name.toString()}/admin/routes.js`,
      defaultImport: `${model.name.camelCase}Routes`
    });
  }

  //export default function route(router: MethodRouter) {}
  source.addFunction({
    isDefaultExport: true,
    name: 'admin',
    parameters: [
      { name: 'server', type: 'Server' }
    ],
    statements: `
      ${Array.from(schema.models.values()).map(
        model => `${model.name.camelCase}Routes(server);`
      ).join('\n')}
    `.trim()
  });
};