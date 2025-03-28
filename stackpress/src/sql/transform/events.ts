//modules
import type { Directory } from 'ts-morph';
//schema
import type Model from '../../schema/spec/Model';
import Registry from '../../schema/Registry';

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
    //import { server } from '@stackpress/ingest/Server';
    source.addImportDeclaration({
      moduleSpecifier: '@stackpress/ingest/Server',
      namedImports: [ 'server' ]
    });
    //import batch from './batch';
    source.addImportDeclaration({
      moduleSpecifier: `./batch`,
      defaultImport: 'batch'
    });
    //import create from './create';
    source.addImportDeclaration({
      moduleSpecifier: `./create`,
      defaultImport: 'create'
    });
    //import detail from './detail';
    source.addImportDeclaration({
      moduleSpecifier: `./detail`,
      defaultImport: 'detail'
    });
    //import get from './get';
    source.addImportDeclaration({
      moduleSpecifier: `./get`,
      defaultImport: 'get'
    });
    //import purge from './purge';
    source.addImportDeclaration({
      moduleSpecifier: `./purge`,
      defaultImport: 'purge'
    });
    //import remove from './remove';
    source.addImportDeclaration({
      moduleSpecifier: `./remove`,
      defaultImport: 'remove'
    });
    //import restore from './restore';
    source.addImportDeclaration({
      moduleSpecifier: `./restore`,
      defaultImport: 'restore'
    });
    //import search from './search';
    source.addImportDeclaration({
      moduleSpecifier: `./search`,
      defaultImport: 'search'
    });
    //import update from './update';
    source.addImportDeclaration({
      moduleSpecifier: `./update`,
      defaultImport: 'update'
    });
    //import upsert from './upsert';
    source.addImportDeclaration({
      moduleSpecifier: `./upsert`,
      defaultImport: 'upsert'
    });
    //const router = server();
    source.addStatements(`
      const router = server();
      router.on('${model.dash}-batch', batch);
      router.on('${model.dash}-create', create);
      router.on('${model.dash}-detail', detail);
      router.on('${model.dash}-get', get);
      router.on('${model.dash}-purge', purge);
      router.on('${model.dash}-remove', remove);
      router.on('${model.dash}-restore', restore);
      router.on('${model.dash}-search', search);
      router.on('${model.dash}-update', update);
      router.on('${model.dash}-upsert', upsert);

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
  //import { Request, Response, Server } from "stackpress/server";';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/server',
    namedImports: [ 'Request', 'Response', 'Server' ]
  });
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
  //export default function ProfileCreateEvent(req: Request, res: Response)
  source.addFunction({
    name: `${model.title}${title}Event`,
    isAsync: true,
    isDefaultExport: true,
    parameters: [
      { name: 'req', type: 'Request' },
      { name: 'res', type: 'Response' },
      { name: 'ctx', type: 'Server' }
    ],
    statements: (`return ${lower}(config)(req, res, ctx);`)
  });
};