//modules
import type { Directory } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../schema/transform/helpers.js';
//stackpress/sql
import generateBatch from './batch.js';
import generateCount from './count.js';
import generateCreate from './create.js';
import generateDelete from './delete.js';
import generateFind from './find.js';
import generateFindAll from './findall.js';
import generateInstall from './install.js';
import generatePurge from './purge.js';
import generateRemove from './remove.js';
import generateRestore from './restore.js';
import generateUninstall from './uninstall.js';
import generateUpdate from './update.js';
import generateUpgrade from './upgrade.js';
import generateUpsert from './upsert.js';

const objects = [ 'Object', 'Json', 'Hash' ];

const typemap: Record<string, string> = {
  String: 'string',
  Text: 'string',
  Number: 'number',
  Integer: 'number',
  Float: 'number',
  Date: 'Date',
  Time: 'Date',
  Datetime: 'Date',
  Json: 'Record<string, ScalarInput>',
  Object: 'Record<string, ScalarInput>',
  Hash: 'Record<string, ScalarInput>'
};

export default function generate(directory: Directory, model: Model) {
  const ids = model.store.ids.filter(
    column => column.type.name in typemap
  );

  const filepath = model.name.toPathName('%s/%sActions.ts');
  //load Profile/index.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules

  //import type { ScalarInput } from '@stackpress/lib/types';
  if (ids.findValue(column => objects.includes(column.type.name))) {
    source.addImportDeclaration({
      namedImports: [ 'ScalarInput' ],
      moduleSpecifier: '@stackpress/lib/types'
    });
  }
  //import type Create from '@stackpress/inquire/Create';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/inquire/Create',
    defaultImport: 'Create'
  });
  //import type Engine from '@stackpress/inquire/Engine';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/inquire/Engine',
    defaultImport: 'Engine'
  });
  //import type { StatusResponse } from '@stackpress/lib/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/lib/types',
    namedImports: [ 'StatusResponse' ]
  });
  //import Nest from '@stackpress/lib/Nest';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/lib/Nest',
    defaultImport: 'Nest'
  });

  //------------------------------------------------------------------//
  // Import Stackpress

  //import type { StoreSelectFilters, StoreSelectQuery } from 'stackpress/sql/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/sql/types',
    namedImports: [ 'StoreSelectFilters', 'StoreSelectQuery' ]
  });
  //import { removeUndefined, removeEmptyStrings } from 'stackpress/schema/helpers';
  source.addImportDeclaration({
    namedImports: [ 'removeUndefined', 'removeEmptyStrings' ],
    moduleSpecifier: 'stackpress/schema/helpers'
  });
  //import Exception from 'stackpress/Exception';
  source.addImportDeclaration({
    defaultImport: 'Exception',
    moduleSpecifier: 'stackpress/Exception'
  });

  //------------------------------------------------------------------//
  // Import Client

  //import type { Profile, ProfileExtended, ProfileActionsInterface, ProfileAssertInterfaceMap } from './types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: './types.js',
    namedImports: [ 
      model.name.toTypeName(),
      model.name.toTypeName('%sExtended'),
      model.name.toTypeName('%sActionsInterface'),
      model.name.toTypeName('%sAssertInterfaceMap')
    ]
  });
  //import ProfileStore from './ProfileStore.js';
  source.addImportDeclaration({
    moduleSpecifier: model.name.toPathName('./%sStore.js'),
    defaultImport: model.name.toClassName('%sStore')
  });

  //------------------------------------------------------------------//
  // Exports
  
  //export default class ProfileActions {};
  const definition = source.addClass({
    name: model.name.toClassName('%sActions'),
    //implements ProfileActionsInterface
    implements: [ model.name.toClassName('%sActionsInterface') ],
    isDefaultExport: true,
  });
  //public readonly store;
  definition.addProperty({
    scope: Scope.Public,
    isReadonly: true,
    name: 'store'
  });
  //public readonly engine: Engine;
  definition.addProperty({
    scope: Scope.Public,
    isReadonly: true,
    type: 'Engine',
    name: 'engine'
  });
  //protected _seed: string;
  definition.addProperty({
    scope: Scope.Protected,
    type: 'string',
    name: '_seed'
  });
  //public constructor(engine: Engine, seed = '') {}
  definition.addConstructor({
    scope: Scope.Public,
    parameters: [{
      name: 'engine',
      type: 'Engine'
    }, {
      name: 'seed',
      initializer: "''"
    }],
    statements: renderCode(TEMPLATE.CONSTRUCTOR, {
      store: model.name.toClassName('%sStore')
    })
  });
  //public async batch(inputs: Array<Partial<Profile>>, mode = 'upsert') {}
  generateBatch(model, definition);
  //public async count(query: StoreSelectFilters & { columns?: string[] }) {}
  generateCount(definition);
  //public async create(input: Partial<Profile>) {}
  generateCreate(model, definition);
  //public async delete(query: StoreSelectFilters) {}
  generateDelete(definition);
  //public async find(query: StoreSelectQuery) {}
  generateFind(definition);
  //public async findAll(query: StoreSelectQuery) {}
  generateFindAll(model, definition);
  //public async install() {}
  generateInstall(definition);
  //public async purge(cascade = false) {}
  generatePurge(definition);
  //public async remove(query: StoreSelectFilters) {}
  generateRemove(model, definition);
  //public async restore(query: StoreSelectFilters) {}
  generateRestore(model, definition);
  //public async uninstall() {}
  generateUninstall(definition);
  //public async update(query: StoreSelectFilters, input: Partial<Profile>) {}
  generateUpdate(model, definition);
  //public async upgrade(to: Create) {}
  generateUpgrade(definition);
  //public async upsert(input: Partial<Profile>) {}
  generateUpsert(model, definition);
};

export const TEMPLATE = {

//public constructor(engine: Engine, seed = '') {}
CONSTRUCTOR:
`this.engine = engine;
this._seed = seed;
this.store = new <%store%>(seed);`,

};