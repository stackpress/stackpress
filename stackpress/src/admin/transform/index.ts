//root
import type { IdeaPluginWithProject } from '../../types';
//schema
import Registry from '../../schema/Registry';
//local
import generatePages from './pages';
import generateViews from './views';
import generateRoutes from './routes';

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
  // - profile/admin/create.ts
  // - profile/admin/detail.ts
  // - profile/admin/remove.ts
  // - profile/admin/restore.ts
  // - profile/admin/search.ts
  // - profile/admin/update.ts
  generatePages(project, registry);
  // - profile/admin/create.tsx
  // - profile/admin/detail.tsx
  // - profile/admin/remove.tsx
  // - profile/admin/restore.tsx
  // - profile/admin/search.tsx
  // - profile/admin/update.tsx
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
    //import admin from './admin/routes';
    source.addImportDeclaration({
      moduleSpecifier: `./admin/routes`,
      defaultImport: 'admin'
    });
    //export { admin };
    source.addExportDeclaration({ namedExports: [ 'admin' ] });
  }
};