//modules
import type { Directory } from 'ts-morph';
//schema
import type Model from '../../schema/spec/Model';
import Registry from '../../schema/Registry';

//map from column types to sql types and helpers
export const typemap: Record<string, string> = {
  String: 'string',
  Text: 'string',
  Number: 'number',
  Integer: 'number',
  Float: 'number',
  Boolean: 'boolean',
  Date: 'string',
  Time: 'string',
  Datetime: 'string',
  Json: 'string',
  Object: 'string',
  Hash: 'string'
};

export default function generate(directory: Directory, registry: Registry) {
  //loop through models
  for (const model of registry.model.values()) {
    // - profile/actions/batch.ts
    batch(model, directory);
    // - profile/actions/create.ts
    create(model, directory);
    // - profile/actions/detail.ts
    detail(model, directory);
    // - profile/actions/get.ts
    get(model, directory);
    // - profile/actions/remove.ts
    remove(model, directory);
    // - profile/actions/restore.ts
    restore(model, directory);
    // - profile/actions/search.ts
    search(model, directory);
    // - profile/actions/update.ts
    update(model, directory);
    // - profile/actions/upsert.ts
    upsert(model, directory);
    // - profile/actions/index.ts
    const source = directory.createSourceFile(
      `${model.name}/actions/index.ts`,
      '', 
      { overwrite: true }
    );
    //import type { ProfileExtended } from '../types';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '../types',
      namedImports: [ 
        model.title,
        `${model.title}Extended`
      ]
    });
    //import Engine from '@stackpress/inquire/Engine';
    source.addImportDeclaration({
      moduleSpecifier: '@stackpress/inquire/Engine',
      defaultImport: 'Engine'
    });
    //import { Actions } from 'stackpress/sql/actions';
    source.addImportDeclaration({
      moduleSpecifier: 'stackpress/sql/actions',
      defaultImport: 'Actions'
    });
    //import config from '../config';
    source.addImportDeclaration({
      moduleSpecifier: `../config`,
      defaultImport: 'config'
    });
    //export default function actions(engine: Engine) {}
    source.addFunction({
      isDefaultExport: true,
      name: 'actions',
      parameters: [ { name: 'engine', type: 'Engine' } ],
      statements: `return new Actions<${model.title}Extended>(config, engine);`
    });
    //import batch from './batch';
    source.addImportDeclaration({
      moduleSpecifier: './batch',
      defaultImport: 'batch'
    });
    //import create from './create';
    source.addImportDeclaration({
      moduleSpecifier: './create',
      defaultImport: 'create'
    });
    //import detail from './detail';
    source.addImportDeclaration({
      moduleSpecifier: './detail',
      defaultImport: 'detail'
    });
    //import get from './get';
    source.addImportDeclaration({
      moduleSpecifier: './get',
      defaultImport: 'get'
    });
    //import remove from './remove';
    source.addImportDeclaration({
      moduleSpecifier: './remove',
      defaultImport: 'remove'
    });
    //import restore from './restore';
    source.addImportDeclaration({
      moduleSpecifier: './restore',
      defaultImport: 'restore'
    });
    //import search from './search';
    source.addImportDeclaration({
      moduleSpecifier: './search',
      defaultImport: 'search'
    });
    //import update from './update';
    source.addImportDeclaration({
      moduleSpecifier: './update',
      defaultImport: 'update'
    });
    //import upsert from './upsert';
    source.addImportDeclaration({
      moduleSpecifier: './upsert',
      defaultImport: 'upsert'
    });
    //export { create, detail, ... }
    source.addExportDeclaration({
      namedExports: [
        'batch',
        'create',
        'detail',
        'get',
        'remove',
        'restore',
        'search',
        'update',
        'upsert'
      ]
    });
  }
};

export function batch(model: Model, directory: Directory) {
  const source = directory.createSourceFile(
    `${model.name}/actions/batch.ts`,
    '', 
    { overwrite: true }
  );
  //import type Engine from '@stackpress/Engine';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/inquire/Engine',
    defaultImport: 'Engine'
  });
  //import type { Profile } from '../types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types',
    namedImports: [ model.title ]
  });
  //import batch from 'stackpress/batch';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/batch',
    defaultImport: 'batch'
  });
  //import config from '../config';
  source.addImportDeclaration({
    moduleSpecifier: `../config`,
    defaultImport: 'config'
  });
  //export default function ProfileBatchAction(engine, rows)
  source.addFunction({
    name: `${model.title}BatchAction`,
    isDefaultExport: true,
    parameters: [
      //engine: Engine,
      { name: 'engine', type: 'Engine' },
      //rows: Profile[]
      { name: 'rows', type: `${model.title}[]` }
    ],
    statements: (`return batch<${model.title}>(config, engine, rows);`)
  });
};

export function create(model: Model, directory: Directory) {
  const source = directory.createSourceFile(
    `${model.name}/actions/create.ts`,
    '', 
    { overwrite: true }
  );
  //import type { NestedObject } from '@stackpress/lib/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/lib/types',
    namedImports: [ 'NestedObject' ]
  });
  //import type Engine from '@stackpress/inquire/Engine';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/inquire/Engine',
    defaultImport: 'Engine'
  });
  //import type { Profile } from '../types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types',
    namedImports: [ model.title ]
  });
  //import create from 'stackpress/create';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/create',
    defaultImport: 'create'
  });
  //import config from '../config';
  source.addImportDeclaration({
    moduleSpecifier: `../config`,
    defaultImport: 'config'
  });
  //export default function ProfileCreateAction(engine, input)
  source.addFunction({
    name: `${model.title}CreateAction`,
    isDefaultExport: true,
    parameters: [
      //engine: Engine,
      { name: 'engine', type: 'Engine' },
      //input: NestedObject
      { name: 'input', type: 'NestedObject' }
    ],
    statements: (`return create<${model.title}>(config, engine, input);`)
  });
};

export function detail(model: Model, directory: Directory) {
  const source = directory.createSourceFile(
    `${model.name}/actions/detail.ts`,
    '', 
    { overwrite: true }
  );
  //import type Engine from '@stackpress/inquire/Engine';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/inquire/Engine',
    defaultImport: 'Engine'
  });
  //import type { ProfileExtended } from '../types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types',
    namedImports: [ `${model.title}Extended` ]
  });
  //import detail from 'stackpress/detail';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/detail',
    defaultImport: 'detail'
  });
  //import config from '../config';
  source.addImportDeclaration({
    moduleSpecifier: `../config`,
    defaultImport: 'config'
  });
  //export default function ProfileDetailAction(engine, ids)
  source.addFunction({
    name: `${model.title}DetailAction`,
    isDefaultExport: true,
    parameters: [
      //engine: Engine,
      { name: 'engine', type: 'Engine' },
      //ids: Record<string, string|number>
      { name: 'ids', type: 'Record<string, string|number>' }
    ],
    statements: (`return detail<${model.title}Extended>(config, engine, ids);`)
  });
};

export function get(model: Model, directory: Directory) {
  const source = directory.createSourceFile(
    `${model.name}/actions/get.ts`,
    '', 
    { overwrite: true }
  );
  //import type Engine from '@stackpress/inquire/Engine';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/inquire/Engine',
    defaultImport: 'Engine'
  });
  //import type { ProfileExtended } from '../types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types',
    namedImports: [ `${model.title}Extended` ]
  });
  //import get from 'stackpress/get';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/get',
    defaultImport: 'get'
  });
  //import config from '../config';
  source.addImportDeclaration({
    moduleSpecifier: `../config`,
    defaultImport: 'config'
  });
  //export default function ProfileGetAction(engine, key, value)
  source.addFunction({
    name: `${model.title}GetAction`,
    isDefaultExport: true,
    parameters: [
      //engine: Engine,
      { name: 'engine', type: 'Engine' },
      //key: string
      { name: 'key', type: 'string' },
      //value: string|number
      { name: 'value', type: 'string|number' }
    ],
    statements: (`return get<${model.title}Extended>(config, engine, key, value);`)
  });
};

export function remove(model: Model, directory: Directory) {
  const source = directory.createSourceFile(
    `${model.name}/actions/remove.ts`,
    '', 
    { overwrite: true }
  );
  //import type Engine from '@stackpress/inquire/Engine';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/inquire/Engine',
    defaultImport: 'Engine'
  });
  //import type { ProfileExtended } from '../types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types',
    namedImports: [ `${model.title}Extended` ]
  });
  //import remove from 'stackpress/remove';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/remove',
    defaultImport: 'remove'
  });
  //import config from '../config';
  source.addImportDeclaration({
    moduleSpecifier: `../config`,
    defaultImport: 'config'
  });
  //export default function ProfileRemoveAction(engine, ids)
  source.addFunction({
    name: `${model.title}RemoveAction`,
    isDefaultExport: true,
    parameters: [
      //engine: Engine,
      { name: 'engine', type: 'Engine' },
      //ids: Record<string, string|number>
      { name: 'ids', type: 'Record<string, string|number>' }
    ],
    statements: (`return remove<${model.title}Extended>(config, engine, ids);`)
  });
};

export function restore(model: Model, directory: Directory) {
  const source = directory.createSourceFile(
    `${model.name}/actions/restore.ts`,
    '', 
    { overwrite: true }
  );
  //import type Engine from '@stackpress/inquire/Engine';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/inquire/Engine',
    defaultImport: 'Engine'
  });
  //import type { ProfileExtended } from '../types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types',
    namedImports: [ `${model.title}Extended` ]
  });
  //import restore from 'stackpress/restore';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/restore',
    defaultImport: 'restore'
  });
  //import config from '../config';
  source.addImportDeclaration({
    moduleSpecifier: `../config`,
    defaultImport: 'config'
  });
  //export default function ProfileRestoreAction(engine, ids)
  source.addFunction({
    name: `${model.title}RestoreAction`,
    isDefaultExport: true,
    parameters: [
      //engine: Engine,
      { name: 'engine', type: 'Engine' },
      //ids: Record<string, string|number>
      { name: 'ids', type: 'Record<string, string|number>' }
    ],
    statements: (`return restore<${model.title}Extended>(config, engine, ids);`)
  });
};

export function search(model: Model, directory: Directory) {
  const source = directory.createSourceFile(
    `${model.name}/actions/search.ts`,
    '', 
    { overwrite: true }
  );
  //import type { SearchParams } from 'stackpress/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/types',
    namedImports: [ 'SearchParams' ]
  });
  //import type Engine from '@stackpress/inquire/Engine';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/inquire/Engine',
    defaultImport: 'Engine'
  });
  //import type { ProfileExtended } from '../types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types',
    namedImports: [ `${model.title}Extended` ]
  });
  //import search from 'stackpress/search';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/search',
    defaultImport: 'search'
  });
  //import config from '../config';
  source.addImportDeclaration({
    moduleSpecifier: `../config`,
    defaultImport: 'config'
  });
  //export default function ProfileSearchAction(engine, params)
  source.addFunction({
    name: `${model.title}SearchAction`,
    isDefaultExport: true,
    parameters: [
      //engine: Engine,
      { name: 'engine', type: 'Engine' },
      //query: SearchParams = {}
      { name: 'params', type: 'SearchParams', initializer: '{}' }
    ],
    statements: (`return search<${model.title}Extended>(config, engine, params);`)
  });
};

export function update(model: Model, directory: Directory) {
  const source = directory.createSourceFile(
    `${model.name}/actions/update.ts`,
    '', 
    { overwrite: true }
  );
  //import type { NestedObject } from '@stackpress/lib/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/lib/types',
    namedImports: [ 'NestedObject' ]
  });
  //import type Engine from '@stackpress/inquire/Engine';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/inquire/Engine',
    defaultImport: 'Engine'
  });
  //import type { ProfileExtended } from '../types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types',
    namedImports: [ `${model.title}Extended` ]
  });
  //import update from 'stackpress/update';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/update',
    defaultImport: 'update'
  });
  //import config from '../config';
  source.addImportDeclaration({
    moduleSpecifier: `../config`,
    defaultImport: 'config'
  });
  //export default function ProfileUpdateAction(engine, ids, input)
  source.addFunction({
    name: `${model.title}UpdateAction`,
    isDefaultExport: true,
    parameters: [
      //engine: Engine,
      { name: 'engine', type: 'Engine' },
      //ids: Record<string, string|number>
      { name: 'ids', type: 'Record<string, string|number>' },
      //input: NestedObject
      { name: 'input', type: 'NestedObject' }
    ],
    statements: (`return update<${model.title}Extended>(config, engine, ids, input);`)
  });
};

export function upsert(model: Model, directory: Directory) {
  const source = directory.createSourceFile(
    `${model.name}/actions/upsert.ts`,
    '', 
    { overwrite: true }
  );
  //import type { NestedObject } from '@stackpress/lib/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/lib/types',
    namedImports: [ 'NestedObject' ]
  });
  //import type Engine from '@stackpress/inquire/Engine';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/inquire/Engine',
    defaultImport: 'Engine'
  });
  //import type { ProfileExtended } from '../types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types',
    namedImports: [ `${model.title}Extended` ]
  });
  //import upsert from 'stackpress/upsert';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/upsert',
    defaultImport: 'upsert'
  });
  //import config from '../config';
  source.addImportDeclaration({
    moduleSpecifier: `../config`,
    defaultImport: 'config'
  });
  //export default function ProfileCreateAction(engine, input)
  source.addFunction({
    name: `${model.title}CreateAction`,
    isDefaultExport: true,
    parameters: [
      //engine: Engine,
      { name: 'engine', type: 'Engine' },
      //input: NestedObject
      { name: 'input', type: 'NestedObject' }
    ],
    statements: (`return upsert<${model.title}Extended>(config, engine, input);`)
  });
};