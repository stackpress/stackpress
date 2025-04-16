//root
import type { IdeaPluginWithProject } from '../../types/index.js';
//schema
import Registry from '../../schema/Registry.js';
//local
import generatePages from './pages.js';
import generateViews from './views/index.js';
import generateRoutes from './routes.js';

/**
 * Client File Structure
 * - profile/
 * | - admin/
 * | | - pages/
 * | | | - create.ts
 * | | | - detail.ts
 * | | | - remove.ts
 * | | | - restore.ts
 * | | | - search.ts
 * | | | - update.ts
 * | | - views/
 * | | | - create.tsx
 * | | | - detail.tsx
 * | | | - remove.tsx
 * | | | - restore.tsx
 * | | | - search.tsx
 * | | | - update.tsx
 * | | - routes.ts
 * - admin.ts
 */

/**
 * This is the The params comes form the cli
 */
export default function generate(props: IdeaPluginWithProject) {
  //-----------------------------//
  // 1. Config
  //extract props
  const { schema, project } = props;
  const registry = new Registry(schema);

  //-----------------------------//
  // 2. Generators
  // - profile/admin/pages/create.ts
  // - profile/admin/pages/detail.ts
  // - profile/admin/pages/remove.ts
  // - profile/admin/pages/restore.ts
  // - profile/admin/pages/search.ts
  // - profile/admin/pages/update.ts
  generatePages(project, registry);
  // - profile/admin/views/create.tsx
  // - profile/admin/views/detail.tsx
  // - profile/admin/views/remove.tsx
  // - profile/admin/views/restore.tsx
  // - profile/admin/views/search.tsx
  // - profile/admin/views/update.tsx
  generateViews(project, registry);
  // - profile/admin/routes.ts
  generateRoutes(project, registry);

  //-----------------------------//
  // 3. profile/index.ts

  for (const model of registry.model.values()) {
    const filepath = `${model.name}/index.ts`;
    //load profile/index.ts if it exists, if not create it
    const source = project.getSourceFile(filepath) 
      || project.createSourceFile(filepath, '', { overwrite: true });
    //import admin from './admin/routes.js';
    source.addImportDeclaration({
      moduleSpecifier: './admin/routes.js',
      defaultImport: 'admin'
    });
    //export { admin };
    source.addExportDeclaration({ namedExports: [ 'admin' ] });
  }
};