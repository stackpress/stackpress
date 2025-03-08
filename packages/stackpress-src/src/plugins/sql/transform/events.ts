//modules
import type { Directory } from 'ts-morph';
//schema
import type Model from '../../../schema/spec/Model';
import Registry from '../../../schema/Registry';

export default function generate(directory: Directory, registry: Registry) {
  //loop through models
  for (const model of registry.model.values()) {
    // - profile/events/batch.ts
    event('batch', model, directory);
    // - profile/events/create.ts
    event('create', model, directory);
    // - profile/events/detail.ts
    event('detail', model, directory);
    // - profile/events/get.ts
    event('get', model, directory);
    // - profile/events/purge.ts
    event('purge', model, directory);
    // - profile/events/remove.ts
    event('remove', model, directory);
    // - profile/events/restore.ts
    event('restore', model, directory);
    // - profile/events/search.ts
    event('search', model, directory);
    // - profile/events/update.ts
    event('update', model, directory);
    // - profile/events/upsert.ts
    event('upsert', model, directory);
    // - profile/events/index.ts
    const source = directory.createSourceFile(
      `${model.name}/events/index.ts`,
      '', 
      { overwrite: true }
    );
    //import ServerRouter from '@stackpress/ingest/dist/router/ServerRouter';
    source.addImportDeclaration({
      moduleSpecifier: '@stackpress/ingest/dist/Router',
      defaultImport: 'ServerRouter'
    });
    //const router = new ServerRouter();
    source.addStatements(`
      const router = new ServerRouter();
      router.imports.on('${model.dash}-batch', () => import('./batch'));
      router.imports.on('${model.dash}-create', () => import('./create'));
      router.imports.on('${model.dash}-detail', () => import('./detail'));
      router.imports.on('${model.dash}-get', () => import('./get'));
      router.imports.on('${model.dash}-purge', () => import('./purge'));
      router.imports.on('${model.dash}-remove', () => import('./remove'));
      router.imports.on('${model.dash}-restore', () => import('./restore'));
      router.imports.on('${model.dash}-search', () => import('./search'));
      router.imports.on('${model.dash}-update', () => import('./update'));
      router.imports.on('${model.dash}-upsert', () => import('./upsert'));

      export default router;
    `);
    //export { create, detail, ... }
    source.addExportDeclaration({
      namedExports: [
        'batch',
        'create',
        'detail',
        'get',
        'purge',
        'remove',
        'restore',
        'search',
        'update',
        'upsert'
      ]
    });
  }
};

export function event(action: string, model: Model, directory: Directory) {
  const lower = action.toLowerCase();
  const title = action.charAt(0).toUpperCase() + action.slice(1);
  const source = directory.createSourceFile(
    `${model.name}/events/${lower}.ts`,
    '', 
    { overwrite: true }
  );
  //import create from 'stackpress/sql/events/create';
  source.addImportDeclaration({
    moduleSpecifier: `stackpress/sql/events/${lower}`,
    defaultImport: lower
  });
  //import config from '../config';
  source.addImportDeclaration({
    moduleSpecifier: `../config`,
    defaultImport: 'config'
  });
  //export default function ProfileCreateEvent(req: ServerRequest, res: Response)
  source.addFunction({
    name: `${model.title}${title}Event`,
    isAsync: true,
    isDefaultExport: true,
    parameters: [
      { name: 'req', type: 'ServerRequest' },
      { name: 'res', type: 'Response' }
    ],
    statements: (`return ${lower}(config)(req, res);`)
  });
};