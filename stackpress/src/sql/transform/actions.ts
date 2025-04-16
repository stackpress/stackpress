//modules
import type { Directory } from 'ts-morph';
//schema
import type Model from '../../schema/spec/Model.js';
import Registry from '../../schema/Registry.js';

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
    //import type { ProfileExtended } from '../types.js';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '../types.js',
      namedImports: [ 
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
      namedImports: [ 'Actions' ]
    });
    //import config from '../config.js';
    source.addImportDeclaration({
      moduleSpecifier: '../config.js',
      defaultImport: 'config'
    });
    //export default function actions(engine: Engine, seed?: string) {}
    source.addFunction({
      isDefaultExport: true,
      name: 'actions',
      parameters: [ 
        { name: 'engine', type: 'Engine' },
        //seed?: string
        { name: 'seed', type: 'string', hasQuestionToken: true }
      ],
      statements: `return new Actions<${model.title}Extended>(config, engine, seed);`
    });
    //import batch from './batch.js';
    source.addImportDeclaration({
      moduleSpecifier: './batch.js',
      defaultImport: 'batch'
    });
    //import create from './create.js';
    source.addImportDeclaration({
      moduleSpecifier: './create.js',
      defaultImport: 'create'
    });
    //import detail from './detail.js';
    source.addImportDeclaration({
      moduleSpecifier: './detail.js',
      defaultImport: 'detail'
    });
    //import get from './get.js';
    source.addImportDeclaration({
      moduleSpecifier: './get.js',
      defaultImport: 'get'
    });
    //import remove from './remove.js';
    source.addImportDeclaration({
      moduleSpecifier: './remove.js',
      defaultImport: 'remove'
    });
    //import restore from './restore';
    source.addImportDeclaration({
      moduleSpecifier: './restore',
      defaultImport: 'restore'
    });
    //import search from './search.js';
    source.addImportDeclaration({
      moduleSpecifier: './search.js',
      defaultImport: 'search'
    });
    //import update from './update.js';
    source.addImportDeclaration({
      moduleSpecifier: './update.js',
      defaultImport: 'update'
    });
    //import upsert from './upsert.js';
    source.addImportDeclaration({
      moduleSpecifier: './upsert.js',
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
  //import type Engine from '@stackpress/inquire/Engine';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/inquire/Engine',
    defaultImport: 'Engine'
  });
  //import type { Profile } from '../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types.js',
    namedImports: [ model.title ]
  });
  //import batch from 'stackpress/sql/actions/batch';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/sql/actions/batch',
    defaultImport: 'batch'
  });
  //import config from '../config.js';
  source.addImportDeclaration({
    moduleSpecifier: '../config.js',
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
      { name: 'rows', type: `${model.title}[]` },
      //seed?: string
      { name: 'seed', type: 'string', hasQuestionToken: true }
    ],
    statements: (`return batch<${model.title}>(config, engine, rows, seed);`)
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
  //import type { Profile } from '../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types.js',
    namedImports: [ model.title ]
  });
  //import create from 'stackpress/sql/actions/create';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/sql/actions/create',
    defaultImport: 'create'
  });
  //import config from '../config.js';
  source.addImportDeclaration({
    moduleSpecifier: '../config.js',
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
      { name: 'input', type: 'NestedObject' },
      //seed?: string
      { name: 'seed', type: 'string', hasQuestionToken: true }
    ],
    statements: (`return create<${model.title}>(config, engine, input, seed);`)
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
  //import type { ProfileExtended } from '../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types.js',
    namedImports: [ `${model.title}Extended` ]
  });
  //import detail from 'stackpress/sql/actions/detail';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/sql/actions/detail',
    defaultImport: 'detail'
  });
  //import config from '../config.js';
  source.addImportDeclaration({
    moduleSpecifier: '../config.js',
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
      { name: 'ids', type: 'Record<string, string|number>' },
      //columns?: string[]
      { name: 'columns', type: 'string[]', hasQuestionToken: true },
      //seed?: string
      { name: 'seed', type: 'string', hasQuestionToken: true }
    ],
    statements: (`return detail<${model.title}Extended>(config, engine, ids, columns);`)
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
  //import type { ProfileExtended } from '../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types.js',
    namedImports: [ `${model.title}Extended` ]
  });
  //import get from 'stackpress/sql/actions/get';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/sql/actions/get',
    defaultImport: 'get'
  });
  //import config from '../config.js';
  source.addImportDeclaration({
    moduleSpecifier: '../config.js',
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
      { name: 'value', type: 'string|number' },
      //columns?: string[]
      { name: 'columns', type: 'string[]', hasQuestionToken: true },
      //seed?: string
      { name: 'seed', type: 'string', hasQuestionToken: true }
    ],
    statements: (`return get<${model.title}Extended>(config, engine, key, value, columns, seed);`)
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
  //import type { ProfileExtended } from '../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types.js',
    namedImports: [ `${model.title}Extended` ]
  });
  //import remove from 'stackpress/sql/actions/remove';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/sql/actions/remove',
    defaultImport: 'remove'
  });
  //import config from '../config.js';
  source.addImportDeclaration({
    moduleSpecifier: '../config.js',
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
  //import type { ProfileExtended } from '../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types.js',
    namedImports: [ `${model.title}Extended` ]
  });
  //import restore from 'stackpress/sql/actions/restore';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/sql/actions/restore',
    defaultImport: 'restore'
  });
  //import config from '../config.js';
  source.addImportDeclaration({
    moduleSpecifier: '../config.js',
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
  //import type { ProfileExtended } from '../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types.js',
    namedImports: [ `${model.title}Extended` ]
  });
  //import search from 'stackpress/sql/actions/search';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/sql/actions/search',
    defaultImport: 'search'
  });
  //import config from '../config.js';
  source.addImportDeclaration({
    moduleSpecifier: '../config.js',
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
      { name: 'params', type: 'SearchParams', initializer: '{}' },
      //seed?: string
      { name: 'seed', type: 'string', hasQuestionToken: true }
    ],
    statements: (`return search<${model.title}Extended>(config, engine, params, seed);`)
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
  //import type { ProfileExtended } from '../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types.js',
    namedImports: [ `${model.title}Extended` ]
  });
  //import update from 'stackpress/sql/actions/update';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/sql/actions/update',
    defaultImport: 'update'
  });
  //import config from '../config.js';
  source.addImportDeclaration({
    moduleSpecifier: '../config.js',
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
      { name: 'input', type: 'NestedObject' },
      //seed?: string
      { name: 'seed', type: 'string', hasQuestionToken: true }
    ],
    statements: (`return update<${model.title}Extended>(config, engine, ids, input, seed);`)
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
  //import type { ProfileExtended } from '../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types.js',
    namedImports: [ `${model.title}Extended` ]
  });
  //import upsert from 'stackpress/sql/actions/upsert';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/sql/actions/upsert',
    defaultImport: 'upsert'
  });
  //import config from '../config.js';
  source.addImportDeclaration({
    moduleSpecifier: '../config.js',
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
      { name: 'input', type: 'NestedObject' },
      //seed?: string
      { name: 'seed', type: 'string', hasQuestionToken: true }
    ],
    statements: (`return upsert<${model.title}Extended>(config, engine, input, seed);`)
  });
};