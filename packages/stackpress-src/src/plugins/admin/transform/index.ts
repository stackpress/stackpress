//common
import type { PluginWithProject } from '../../../types';
//schema
import Registry from '../../../schema/Registry';
//local
import generatePages from './pages';
import generateTemplates from './templates';
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
 * | | - templates/
 * | | | - create.ink
 * | | | - detail.ink
 * | | | - remove.ink
 * | | | - restore.ink
 * | | | - search.ink
 * | | | - update.ink
 * | | - routes.ts
 * - admin.ts
 */

/**
 * This is the The params comes form the cli
 */
export default function generate(props: PluginWithProject) {
  //-----------------------------//
  // 1. Config
  //extract props
  const { cli, schema, project } = props;
  const registry = new Registry(schema);
  const fs = cli.server.loader.fs;

  //-----------------------------//
  // 2. Generators
  // - profile/admin/create.ts
  // - profile/admin/detail.ts
  // - profile/admin/remove.ts
  // - profile/admin/restore.ts
  // - profile/admin/search.ts
  // - profile/admin/update.ts
  generatePages(project, registry);
  // - profile/admin/create.ink
  // - profile/admin/detail.ink
  // - profile/admin/remove.ink
  // - profile/admin/restore.ink
  // - profile/admin/search.ink
  // - profile/admin/update.ink
  generateTemplates(project, registry, fs);
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